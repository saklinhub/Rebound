package com.razorpay.recovery.repository;

import com.razorpay.recovery.model.entity.AuditEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditEntry, Long> {
    List<AuditEntry> findByTransactionIdOrderByTimestampDesc(String transactionId);
}
