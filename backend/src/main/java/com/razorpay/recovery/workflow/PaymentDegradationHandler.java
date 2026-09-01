package com.razorpay.recovery.workflow;

import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.FailureReason;
import com.razorpay.recovery.model.enums.InterventionType;
import com.razorpay.recovery.model.enums.WorkflowType;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class PaymentDegradationHandler implements WorkflowHandler {

    @Override
    public String getWorkflowType() {
        return WorkflowType.PAYMENT_DEGRADATION.name();
    }

    @Override
    public List<String> getAllowedInterventions(Transaction t) {
        if (t.isRiskFlag() || 
            FailureReason.DO_NOT_HONOR.name().equals(t.getFailureReason()) || 
            t.getRetryCount() >= 3) {
            return List.of(InterventionType.FLAG_FOR_HUMAN.name());
        }
        
        if (FailureReason.CARD_EXPIRED.name().equals(t.getFailureReason())) {
            return Arrays.asList(InterventionType.REQUEST_NEW_CARD.name(), InterventionType.FLAG_FOR_HUMAN.name());
        }
        
        if (t.getPaymentMethod() != null && t.getPaymentMethod().toLowerCase().contains("card")) {
            return Arrays.asList(InterventionType.ROUTE_TO_UPI.name(), InterventionType.RETRY_SAME_METHOD.name(), InterventionType.FLAG_FOR_HUMAN.name());
        }
        
        if ("upi".equalsIgnoreCase(t.getPaymentMethod())) {
            return Arrays.asList(InterventionType.ROUTE_TO_NETBANKING.name(), InterventionType.RETRY_SAME_METHOD.name(), InterventionType.FLAG_FOR_HUMAN.name());
        }
        
        return Arrays.asList(InterventionType.RETRY_SAME_METHOD.name(), InterventionType.FLAG_FOR_HUMAN.name());
    }

    @Override
    public String getStoppingRulesText(Transaction t) {
        return "Max 3 retries. DO_NOT_HONOR and RISK_THRESHOLD_BREACH go to human immediately. Same failure twice → escalate. All escalations are terminal for automation.";
    }

    @Override
    public boolean shouldEscalate(Transaction t) {
        if (t.isRiskFlag() || FailureReason.RISK_THRESHOLD_BREACH.name().equals(t.getFailureReason()) ||
            FailureReason.DO_NOT_HONOR.name().equals(t.getFailureReason())) {
            return true;
        }
        return t.getRetryCount() >= 3;
    }

    @Override
    public String applyFallbackIntervention(Transaction t) {
        if (shouldEscalate(t)) {
            return InterventionType.FLAG_FOR_HUMAN.name();
        }
        return InterventionType.RETRY_SAME_METHOD.name();
    }

    @Override
    public double getSuccessRate(String intervention) {
        if (InterventionType.RETRY_SAME_METHOD.name().equals(intervention)) return 0.58;
        if (InterventionType.ROUTE_TO_UPI.name().equals(intervention)) return 0.74;
        if (InterventionType.ROUTE_TO_NETBANKING.name().equals(intervention)) return 0.68;
        if (InterventionType.REQUEST_NEW_CARD.name().equals(intervention)) return 0.38;
        if (InterventionType.FLAG_FOR_HUMAN.name().equals(intervention)) return 0.0;
        return 0.0;
    }
}
