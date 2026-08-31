package com.razorpay.recovery.model.dto;

import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.model.enums.WorkflowType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private String id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private BigDecimal amount;
    private String paymentMethod;
    private String failureReason;
    private WorkflowType workflow;
    private TransactionStatus status;
    private boolean recurring;
    private boolean b2b;
    private Integer daysOverdue;
    private String dropStep;
    private int retryCount;
    private int touches;
    private String agentDiagnosis;
    private String agentIntervention;
    private Integer agentConfidence;
    private String agentMessage;
    private String agentReasoning;
    private boolean riskFlag;
    private String outcome;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
    private List<AuditEntryDTO> auditLog;
}
