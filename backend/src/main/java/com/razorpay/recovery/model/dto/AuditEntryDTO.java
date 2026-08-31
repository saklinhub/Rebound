package com.razorpay.recovery.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEntryDTO {
    private Long id;
    private String transactionId;
    private LocalDateTime timestamp;
    private String action;
    private String detail;
    private String intervention;
    private Integer confidence;
    private String outcome;
    private boolean apiFallback;
    private String geminiRawResponse;
    private Long processingTimeMs;
}
