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
public class WebSocketEventDTO {
    private String type;
    private String transactionId;
    private String status;
    private String workflow;
    private Double amount;
    private String intervention;
    private String outcome;
    private Double totalRecovered;
    private Integer processedCount;
    private String timestamp;
    private Integer batchNumber;
    private DashboardStatsDTO summary;
}
