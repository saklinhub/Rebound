package com.razorpay.recovery.workflow;

import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.InterventionType;
import com.razorpay.recovery.model.enums.WorkflowType;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CheckoutRecoveryHandler implements WorkflowHandler {

    @Override
    public String getWorkflowType() {
        return WorkflowType.CHECKOUT_RECOVERY.name();
    }

    @Override
    public List<String> getAllowedInterventions(Transaction t) {
        if (t.getTouches() >= 2) {
            return List.of(InterventionType.MARK_LOST.name());
        }
        
        if (t.getTouches() == 0) {
            return List.of(InterventionType.SEND_CART_LINK.name());
        }
        
        if (t.getTouches() == 1) {
            double ltv = t.getAmount() != null ? t.getAmount().doubleValue() * 3.5 : 0;
            if (ltv > 5000) {
                return List.of(InterventionType.SEND_OFFER.name());
            } else {
                return List.of(InterventionType.MARK_LOST.name());
            }
        }
        return List.of(InterventionType.MARK_LOST.name());
    }

    @Override
    public String getStoppingRulesText(Transaction t) {
        return "Max 2 touches per customer. 24-hour cooldown between touches. MARK_LOST is terminal. Offer only sent if estimated LTV exceeds ₹5,000.";
    }

    @Override
    public boolean shouldEscalate(Transaction t) {
        return t.getTouches() >= 2;
    }

    @Override
    public String applyFallbackIntervention(Transaction t) {
        if (t.getTouches() == 0) {
            return InterventionType.SEND_CART_LINK.name();
        }
        return InterventionType.MARK_LOST.name();
    }

    @Override
    public double getSuccessRate(String intervention) {
        if (InterventionType.SEND_CART_LINK.name().equals(intervention)) return 0.33;
        if (InterventionType.SEND_OFFER.name().equals(intervention)) return 0.27;
        if (InterventionType.MARK_LOST.name().equals(intervention)) return 0.0;
        return 0.0;
    }
}
