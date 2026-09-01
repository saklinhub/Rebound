package com.razorpay.recovery.workflow;

import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.InterventionType;
import com.razorpay.recovery.model.enums.WorkflowType;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SubscriptionRecoveryHandler implements WorkflowHandler {

    @Override
    public String getWorkflowType() {
        return WorkflowType.SUBSCRIPTION_RECOVERY.name();
    }

    @Override
    public List<String> getAllowedInterventions(Transaction t) {
        switch (t.getRetryCount()) {
            case 0: return List.of(InterventionType.SOFT_RETRY.name());
            case 1: return List.of(InterventionType.ALTERNATE_METHOD.name());
            case 2: return List.of(InterventionType.SEND_UPDATE_LINK.name());
            case 3: return List.of(InterventionType.FINAL_NOTICE.name());
            default: return List.of(InterventionType.GRACEFUL_DOWNGRADE.name());
        }
    }

    @Override
    public String getStoppingRulesText(Transaction t) {
        return "Sequential retry ladder. Stop immediately on success. Never hard-cancel. Graceful downgrade preserves customer for win-back campaigns.";
    }

    @Override
    public boolean shouldEscalate(Transaction t) {
        return t.getRetryCount() >= 4;
    }

    @Override
    public String applyFallbackIntervention(Transaction t) {
        return getAllowedInterventions(t).get(0);
    }

    @Override
    public double getSuccessRate(String intervention) {
        if (InterventionType.SOFT_RETRY.name().equals(intervention)) return 0.44;
        if (InterventionType.ALTERNATE_METHOD.name().equals(intervention)) return 0.53;
        if (InterventionType.SEND_UPDATE_LINK.name().equals(intervention)) return 0.29;
        if (InterventionType.FINAL_NOTICE.name().equals(intervention)) return 0.18;
        if (InterventionType.GRACEFUL_DOWNGRADE.name().equals(intervention)) return 0.0;
        return 0.0;
    }
}
