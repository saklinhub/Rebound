package com.razorpay.recovery.model.entity;

import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.model.enums.WorkflowType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    private String id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "failure_reason")
    private String failureReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkflowType workflow;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    private boolean recurring;

    private boolean b2b;

    @Column(name = "days_overdue")
    private Integer daysOverdue;

    @Column(name = "drop_step")
    private String dropStep;

    @Column(name = "retry_count")
    private int retryCount;

    private int touches;

    @Column(name = "agent_diagnosis")
    private String agentDiagnosis;

    @Column(name = "agent_intervention")
    private String agentIntervention;

    @Column(name = "agent_confidence")
    private Integer agentConfidence;

    @Column(name = "agent_message")
    private String agentMessage;

    @Column(name = "agent_reasoning")
    private String agentReasoning;

    @Column(name = "risk_flag")
    private boolean riskFlag;

    private String outcome;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AuditEntry> auditLog;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
