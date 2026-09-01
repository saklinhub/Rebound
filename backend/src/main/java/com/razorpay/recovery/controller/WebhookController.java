package com.razorpay.recovery.controller;

import com.razorpay.recovery.model.dto.WebSocketEventDTO;
import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.model.enums.WorkflowType;
import com.razorpay.recovery.repository.TransactionRepository;
import com.razorpay.recovery.service.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private final TransactionRepository transactionRepository;
    private final WebSocketNotificationService wsService;

    @PostMapping("/razorpay")
    public ResponseEntity<?> handleRazorpayWebhook(@RequestBody Map<String, Object> payload) {
        // Simulating the ingestion of a failed payment webhook
        Map<String, Object> paymentData = null;
        try {
            Map<String, Object> p = (Map<String, Object>) payload.get("payload");
            Map<String, Object> p2 = (Map<String, Object>) p.get("payment");
            paymentData = (Map<String, Object>) p2.get("entity");
        } catch (Exception e) {
            // Simplified for demo robustness
            paymentData = payload;
        }

        Transaction t = new Transaction();
        t.setId("WH_" + UUID.randomUUID().toString().substring(0, 10));
        t.setAmount(new BigDecimal(paymentData.getOrDefault("amount", "1000").toString()));
        t.setPaymentMethod(paymentData.getOrDefault("method", "card").toString());
        t.setFailureReason(paymentData.getOrDefault("error_code", "NETWORK_ERROR").toString());
        t.setCustomerName(paymentData.getOrDefault("customer_name", "Webhook User").toString());
        t.setCustomerEmail("webhook@example.com");
        
        t.setWorkflow(WorkflowType.PAYMENT_DEGRADATION);
        t.setStatus(TransactionStatus.AT_RISK);
        t.setCreatedAt(LocalDateTime.now());
        
        transactionRepository.save(t);

        wsService.emitEvent(WebSocketEventDTO.builder()
                .type("NEW_TRANSACTION_DETECTED")
                .transactionId(t.getId())
                .amount(t.getAmount().doubleValue())
                .timestamp(LocalDateTime.now().toString())
                .build());

        return ResponseEntity.ok().build();
    }
}
