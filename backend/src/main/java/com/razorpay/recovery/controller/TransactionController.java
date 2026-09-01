package com.razorpay.recovery.controller;

import com.razorpay.recovery.model.dto.AuditEntryDTO;
import com.razorpay.recovery.model.dto.TransactionDTO;
import com.razorpay.recovery.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getTransactions(
            @RequestParam(required = false) String workflow,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean riskFlag
    ) {
        List<TransactionDTO> all = transactionService.getAllTransactions();
        
        if (workflow != null && !workflow.trim().isEmpty()) {
            all = all.stream().filter(t -> t.getWorkflow().name().equalsIgnoreCase(workflow)).collect(Collectors.toList());
        }
        if (status != null && !status.trim().isEmpty()) {
            all = all.stream().filter(t -> t.getStatus().name().equalsIgnoreCase(status)).collect(Collectors.toList());
        }
        if (riskFlag != null) {
            all = all.stream().filter(t -> t.isRiskFlag() == riskFlag).collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(all);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransaction(@PathVariable String id) {
        TransactionDTO dto = transactionService.getTransaction(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/audit")
    public ResponseEntity<List<AuditEntryDTO>> getTransactionAudit(@PathVariable String id) {
        return ResponseEntity.ok(transactionService.getAuditLog(id));
    }
}
