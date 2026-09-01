package com.razorpay.recovery.service;

import com.razorpay.recovery.workflow.WorkflowHandler;
import org.springframework.stereotype.Service;

@Service
public class RecoverySimulationService {

    public String simulateOutcome(String intervention, WorkflowHandler handler) {
        if (intervention == null) return "failed";
        
        if (intervention.endsWith("_HUMAN") || 
            "ESCALATE_TO_HUMAN".equals(intervention) || 
            "MARK_LOST".equals(intervention) || 
            "GRACEFUL_DOWNGRADE".equals(intervention) ||
            "FLAG_FOR_HUMAN".equals(intervention)) {
            
            if ("MARK_LOST".equals(intervention) || "GRACEFUL_DOWNGRADE".equals(intervention)) {
                return "failed";
            }
            return "escalated";
        }

        double successRate = handler.getSuccessRate(intervention);
        return Math.random() < successRate ? "recovered" : "failed";
    }
}
