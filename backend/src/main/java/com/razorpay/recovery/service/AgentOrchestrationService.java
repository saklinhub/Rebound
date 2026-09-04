package com.razorpay.recovery.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.recovery.model.dto.AgentDecisionDTO;
import com.razorpay.recovery.model.dto.DashboardStatsDTO;
import com.razorpay.recovery.model.dto.WebSocketEventDTO;
import com.razorpay.recovery.model.entity.AuditEntry;
import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.repository.AuditRepository;
import com.razorpay.recovery.repository.TransactionRepository;
import com.razorpay.recovery.workflow.WorkflowHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AgentOrchestrationService {

    private final TransactionRepository transactionRepository;
    private final AuditRepository auditRepository;
    private final GeminiService geminiService;
    private final RecoverySimulationService simulationService;
    private final WebSocketNotificationService wsService;
    private final RazorpayService razorpayService;
    private final ObjectMapper objectMapper;
    private final List<WorkflowHandler> workflowHandlers;

    @Value("${agent.batch-size:5}")
    private int batchSize;

    @Value("${agent.batch-delay-ms:800}")
    private long batchDelayMs;

    private final AtomicBoolean agentRunning = new AtomicBoolean(false);
    private final AtomicInteger processedCount = new AtomicInteger(0);
    private final AtomicReference<Double> totalRecovered = new AtomicReference<>(0.0);
    private final AtomicReference<LocalDateTime> startedAt = new AtomicReference<>(null);

    public boolean isRunning() {
        return agentRunning.get();
    }

    public void cancelAgent() {
        agentRunning.set(false);
    }

    public int getProcessedCount() {
        return processedCount.get();
    }

    public double getTotalRecovered() {
        return totalRecovered.get();
    }

    public LocalDateTime getStartedAt() {
        return startedAt.get();
    }

    @Async
    public void runRecoveryBatch(String geminiApiKey) {
        if (!agentRunning.compareAndSet(false, true)) {
            throw new IllegalStateException("Agent already running");
        }

        processedCount.set(0);
        totalRecovered.set(0.0);
        startedAt.set(LocalDateTime.now());

        Map<String, WorkflowHandler> handlerMap = workflowHandlers.stream()
                .collect(Collectors.toMap(WorkflowHandler::getWorkflowType, h -> h));

        List<Transaction> atRisk = transactionRepository.findByStatus(TransactionStatus.AT_RISK);
        Collections.shuffle(atRisk); // Randomize for demo effect

        wsService.emitEvent(WebSocketEventDTO.builder()
                .type("AGENT_STARTED")
                .timestamp(LocalDateTime.now().toString())
                .build());

        int batchCount = (int) Math.ceil((double) atRisk.size() / batchSize);
        int currentBatch = 1;

        try {
            for (int i = 0; i < atRisk.size(); i += batchSize) {
                if (!agentRunning.get()) break; // Cancelled

                int end = Math.min(i + batchSize, atRisk.size());
                List<Transaction> batch = atRisk.subList(i, end);

                for (Transaction t : batch) {
                    processTransaction(t, handlerMap.get(t.getWorkflow().name()), geminiApiKey);
                }

                wsService.emitEvent(WebSocketEventDTO.builder()
                        .type("BATCH_COMPLETE")
                        .batchNumber(currentBatch++)
                        .timestamp(LocalDateTime.now().toString())
                        .build());

                Thread.sleep(batchDelayMs);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            agentRunning.set(false);
            wsService.emitEvent(WebSocketEventDTO.builder()
                    .type("AGENT_COMPLETE")
                    .timestamp(LocalDateTime.now().toString())
                    // Summary would ideally be fetched from a DashboardService, leaving empty or building mock for now
                    .build());
        }
    }

    @Transactional
    protected void processTransaction(Transaction t, WorkflowHandler handler, String geminiApiKey) {
        long startTime = System.currentTimeMillis();
        
        t.setStatus(TransactionStatus.DIAGNOSING);
        transactionRepository.save(t);
        emitUpdate(t);

        List<String> allowedInterventions = handler.getAllowedInterventions(t);
        String stoppingRules = handler.getStoppingRulesText(t);
        
        String intervention = null;
        Integer confidence = null;
        String diagnosis = null;
        boolean isFallback = false;
        String rawResponse = null;
        String finalMessage = "";
        
        if (handler.shouldEscalate(t)) {
            intervention = handler.applyFallbackIntervention(t);
            diagnosis = "Automated rule triggered escalation.";
            isFallback = true;
            confidence = 100;
        } else {
            try {
                AgentDecisionDTO decision = geminiService.callGemini(t, allowedInterventions, stoppingRules, geminiApiKey);
                intervention = decision.getIntervention();
                if (!allowedInterventions.contains(intervention)) {
                    intervention = handler.applyFallbackIntervention(t); // Safety
                    isFallback = true;
                }
                confidence = decision.getConfidence();
                diagnosis = decision.getDiagnosis();
                rawResponse = objectMapper.writeValueAsString(decision);
                finalMessage = decision.getMessageToCustomer() != null ? decision.getMessageToCustomer() : "";
                
                t.setAgentReasoning(decision.getReasoning());
                t.setRiskFlag(decision.isRiskFlag());
                
            } catch (Exception e) {
                log.error("Gemini AI Engine failed for transaction {}: {}", t.getId(), e.getMessage());
                intervention = handler.applyFallbackIntervention(t);
                isFallback = true;
                diagnosis = "System encountered AI provider error. Escalated to manual fallback.";
                confidence = 100;
                finalMessage = "Notice: This transaction has been automatically escalated to a human agent due to system load.";
            }
        }

        t.setAgentConfidence(confidence);
        t.setAgentDiagnosis(diagnosis);
        t.setAgentIntervention(intervention);
        
        if (intervention != null && (intervention.equals("ROUTE_TO_UPI") || intervention.equals("CART_RECOVERY_LINK") || intervention.equals("SEND_DISCOUNT"))) {
            String shortUrl = razorpayService.generatePaymentLink(t, "Rebound Recovery: " + intervention);
            finalMessage = finalMessage + "\n\n[Live Payment Link generated]: " + shortUrl;
        }
        
        t.setAgentMessage(finalMessage);

        t.setStatus(TransactionStatus.INTERVENING);
        transactionRepository.save(t);
        emitUpdate(t);

        String outcome = simulationService.simulateOutcome(intervention, handler);
        
        t.setOutcome(outcome);
        t.setStatus(TransactionStatus.valueOf(outcome.toUpperCase()));
        t.setProcessedAt(LocalDateTime.now());
        t.setTouches(t.getTouches() + 1);
        t.setRetryCount(t.getRetryCount() + 1);
        
        transactionRepository.save(t);
        
        AuditEntry audit = AuditEntry.builder()
                .transaction(t)
                .action("AGENT_PROCESSED")
                .detail(diagnosis)
                .intervention(intervention)
                .confidence(confidence)
                .outcome(outcome)
                .apiFallback(isFallback)
                .geminiRawResponse(rawResponse)
                .processingTimeMs(System.currentTimeMillis() - startTime)
                .build();
                
        auditRepository.save(audit);
        
        int currentProcessed = processedCount.incrementAndGet();
        if ("recovered".equals(outcome)) {
            totalRecovered.updateAndGet(v -> v + t.getAmount().doubleValue());
        }

        WebSocketEventDTO update = WebSocketEventDTO.builder()
                .type("TRANSACTION_UPDATE")
                .transactionId(t.getId())
                .status(t.getStatus().name())
                .workflow(t.getWorkflow().name())
                .amount(t.getAmount().doubleValue())
                .intervention(intervention)
                .outcome(outcome)
                .totalRecovered(totalRecovered.get())
                .processedCount(currentProcessed)
                .timestamp(LocalDateTime.now().toString())
                .build();
                
        wsService.emitEvent(update);
    }

    private void emitUpdate(Transaction t) {
        wsService.emitEvent(WebSocketEventDTO.builder()
                .type("TRANSACTION_UPDATE")
                .transactionId(t.getId())
                .status(t.getStatus().name())
                .workflow(t.getWorkflow().name())
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}
