package com.razorpay.recovery.service;

import com.razorpay.recovery.model.dto.AuditEntryDTO;
import com.razorpay.recovery.model.dto.TransactionDTO;
import com.razorpay.recovery.model.entity.AuditEntry;
import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.repository.AuditRepository;
import com.razorpay.recovery.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AuditRepository auditRepository;
    private final DataSeedService dataSeedService;

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TransactionDTO getTransaction(String id) {
        return transactionRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public List<AuditEntryDTO> getAuditLog(String id) {
        return auditRepository.findByTransactionIdOrderByTimestampDesc(id).stream().map(this::toAuditDTO).collect(Collectors.toList());
    }

    public void resetAll() {
        transactionRepository.deleteAll();
        auditRepository.deleteAll();
        dataSeedService.seedData();
    }

    private TransactionDTO toDTO(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .customerName(t.getCustomerName())
                .customerEmail(t.getCustomerEmail())
                .customerPhone(t.getCustomerPhone())
                .amount(t.getAmount())
                .paymentMethod(t.getPaymentMethod())
                .failureReason(t.getFailureReason())
                .workflow(t.getWorkflow())
                .status(t.getStatus())
                .recurring(t.isRecurring())
                .b2b(t.isB2b())
                .daysOverdue(t.getDaysOverdue())
                .dropStep(t.getDropStep())
                .retryCount(t.getRetryCount())
                .touches(t.getTouches())
                .agentDiagnosis(t.getAgentDiagnosis())
                .agentIntervention(t.getAgentIntervention())
                .agentConfidence(t.getAgentConfidence())
                .agentMessage(t.getAgentMessage())
                .agentReasoning(t.getAgentReasoning())
                .riskFlag(t.isRiskFlag())
                .outcome(t.getOutcome())
                .createdAt(t.getCreatedAt())
                .processedAt(t.getProcessedAt())
                .auditLog(getAuditLog(t.getId()))
                .build();
    }

    private AuditEntryDTO toAuditDTO(AuditEntry a) {
        return AuditEntryDTO.builder()
                .id(a.getId())
                .transactionId(a.getTransaction().getId())
                .timestamp(a.getTimestamp())
                .action(a.getAction())
                .detail(a.getDetail())
                .intervention(a.getIntervention())
                .confidence(a.getConfidence())
                .outcome(a.getOutcome())
                .apiFallback(a.isApiFallback())
                .geminiRawResponse(a.getGeminiRawResponse())
                .processingTimeMs(a.getProcessingTimeMs())
                .build();
    }
}
