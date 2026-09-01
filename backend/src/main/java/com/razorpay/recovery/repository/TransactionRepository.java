package com.razorpay.recovery.repository;

import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.model.enums.WorkflowType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByStatus(TransactionStatus status);
    List<Transaction> findByWorkflow(WorkflowType workflow);
    List<Transaction> findByRiskFlag(boolean riskFlag);
}
