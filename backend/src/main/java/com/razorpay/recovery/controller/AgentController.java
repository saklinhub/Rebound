package com.razorpay.recovery.controller;

import com.razorpay.recovery.service.AgentOrchestrationService;
import com.razorpay.recovery.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    private final AgentOrchestrationService agentService;
    private final TransactionService transactionService;

    @PostMapping("/run")
    public ResponseEntity<?> runAgent(@RequestHeader("X-Gemini-Key") String geminiApiKey) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "X-Gemini-Key header is required"));
        }
        
        if (agentService.isRunning()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Agent already running"));
        }
        
        agentService.runRecoveryBatch(geminiApiKey);
        
        return ResponseEntity.ok(Map.of("message", "Agent started", "totalTransactions", 200));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetAgent() {
        if (agentService.isRunning()) {
            agentService.cancelAgent();
            // Allow time for threads to stop gracefully
            try { Thread.sleep(500); } catch (InterruptedException ignored) {}
        }
        
        transactionService.resetAll();
        return ResponseEntity.ok(Map.of("message", "Reset complete", "transactionsReset", 200));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(Map.of(
            "running", agentService.isRunning(),
            "processedCount", agentService.getProcessedCount(),
            "totalTransactions", 200, // For demo purposes
            "totalRecovered", agentService.getTotalRecovered(),
            "startedAt", agentService.getStartedAt() != null ? agentService.getStartedAt().toString() : null
        ));
    }
}
