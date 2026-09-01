package com.razorpay.recovery.workflow;

import com.razorpay.recovery.model.entity.Transaction;

import java.util.List;

public interface WorkflowHandler {
    String getWorkflowType();
    List<String> getAllowedInterventions(Transaction t);
    String getStoppingRulesText(Transaction t);
    boolean shouldEscalate(Transaction t);
    String applyFallbackIntervention(Transaction t);
    double getSuccessRate(String intervention);
}
