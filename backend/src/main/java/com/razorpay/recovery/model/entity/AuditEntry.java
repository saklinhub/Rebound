package com.razorpay.recovery.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    @JsonIgnore
    private Transaction transaction;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String action;

    private String detail;

    private String intervention;

    private Integer confidence;

    private String outcome;

    @Column(name = "api_fallback")
    private boolean apiFallback;

    @Column(name = "gemini_raw_response")
    private String geminiRawResponse;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) this.timestamp = LocalDateTime.now();
    }
}
