package com.razorpay.recovery.workflow;

import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.InterventionType;
import com.razorpay.recovery.model.enums.WorkflowType;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ReceivablesChaserHandler implements WorkflowHandler {

    @Override
    public String getWorkflowType() {
        return WorkflowType.RECEIVABLES_CHASER.name();
    }

    @Override
    public List<String> getAllowedInterventions(Transaction t) {
        if (t.getAmount() != null && t.getAmount().doubleValue() > 50000) {
            return List.of(InterventionType.ESCALATE_TO_HUMAN.name());
        }
        if (t.getDaysOverdue() != null && t.getDaysOverdue() >= 30) {
            return List.of(InterventionType.ESCALATE_TO_HUMAN.name());
        }
        if (t.getDaysOverdue() != null && t.getDaysOverdue() >= 15) {
            return Arrays.asList(InterventionType.FORMAL_NOTICE.name(), InterventionType.ESCALATE_TO_HUMAN.name());
        }
        return Arrays.asList(InterventionType.FRIENDLY_REMINDER.name(), InterventionType.FORMAL_NOTICE.name());
    }

    @Override
    public String getStoppingRulesText(Transaction t) {
        return "Invoices >₹50,000 or >30 days overdue go directly to human. Max 3 automated touches. Promise-to-pay freezes automation for 5 days.";
    }

    @Override
    public boolean shouldEscalate(Transaction t) {
        if (t.getAmount() != null && t.getAmount().doubleValue() > 50000) return true;
        if (t.getDaysOverdue() != null && t.getDaysOverdue() >= 30) return true;
        return false;
    }

    @Override
    public String applyFallbackIntervention(Transaction t) {
        if (shouldEscalate(t)) {
            return InterventionType.ESCALATE_TO_HUMAN.name();
        }
        return InterventionType.FRIENDLY_REMINDER.name();
    }

    @Override
    public double getSuccessRate(String intervention) {
        if (InterventionType.FRIENDLY_REMINDER.name().equals(intervention)) return 0.48;
        if (InterventionType.FORMAL_NOTICE.name().equals(intervention)) return 0.34;
        if (InterventionType.ESCALATE_TO_HUMAN.name().equals(intervention)) return 0.0;
        return 0.0;
    }
}
