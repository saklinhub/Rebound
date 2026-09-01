package com.razorpay.recovery.controller;

import com.razorpay.recovery.model.dto.DashboardStatsDTO;
import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransactionRepository transactionRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        List<Transaction> all = transactionRepository.findAll();
        
        double totalAtRisk = all.stream().filter(t -> t.getStatus() == TransactionStatus.AT_RISK)
                .mapToDouble(t -> t.getAmount().doubleValue()).sum();
        
        double totalRecovered = all.stream().filter(t -> t.getStatus() == TransactionStatus.RECOVERED)
                .mapToDouble(t -> t.getAmount().doubleValue()).sum();
                
        double totalFailed = all.stream().filter(t -> t.getStatus() == TransactionStatus.FAILED)
                .mapToDouble(t -> t.getAmount().doubleValue()).sum();
                
        double totalEscalated = all.stream().filter(t -> t.getStatus() == TransactionStatus.ESCALATED)
                .mapToDouble(t -> t.getAmount().doubleValue()).sum();

        long processed = all.stream().filter(t -> t.getStatus() != TransactionStatus.AT_RISK).count();
        long recovered = all.stream().filter(t -> t.getStatus() == TransactionStatus.RECOVERED).count();
        double recoveryRate = processed > 0 ? ((double) recovered / processed) * 100.0 : 0.0;

        Map<String, Long> countByStatus = all.stream()
                .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));
                
        Map<String, Long> countByWorkflow = all.stream()
                .collect(Collectors.groupingBy(t -> t.getWorkflow().name(), Collectors.counting()));

        Map<String, Double> recoveredByWorkflow = all.stream()
                .filter(t -> t.getStatus() == TransactionStatus.RECOVERED)
                .collect(Collectors.groupingBy(t -> t.getWorkflow().name(), 
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())));

        Map<String, Double> atRiskByWorkflow = all.stream()
                .filter(t -> t.getStatus() == TransactionStatus.AT_RISK)
                .collect(Collectors.groupingBy(t -> t.getWorkflow().name(), 
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())));

        long riskFlagCount = all.stream().filter(Transaction::isRiskFlag).count();

        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalAtRisk(totalAtRisk)
                .totalRecovered(totalRecovered)
                .totalFailed(totalFailed)
                .totalEscalated(totalEscalated)
                .recoveryRate(recoveryRate)
                .countByStatus(countByStatus)
                .countByWorkflow(countByWorkflow)
                .recoveredByWorkflow(recoveredByWorkflow)
                .atRiskByWorkflow(atRiskByWorkflow)
                .riskFlagCount(riskFlagCount)
                .totalProcessed(processed)
                .recoveryTimeline(new ArrayList<>()) // Simplified for demo
                .build();
                
        return ResponseEntity.ok(stats);
    }
}
