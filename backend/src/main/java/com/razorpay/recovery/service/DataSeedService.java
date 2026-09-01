package com.razorpay.recovery.service;

import com.razorpay.recovery.model.entity.Transaction;
import com.razorpay.recovery.model.enums.FailureReason;
import com.razorpay.recovery.model.enums.TransactionStatus;
import com.razorpay.recovery.model.enums.WorkflowType;
import com.razorpay.recovery.repository.TransactionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DataSeedService {

    private final TransactionRepository transactionRepository;
    private final Random random = new Random();

    private final List<String> FIRST_NAMES = Arrays.asList("Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Rohit", "Kavya", "Amit", "Divya", "Karan", "Pooja", "Nikhil", "Shreya", "Aditya", "Meera", "Siddharth", "Nisha", "Gaurav", "Riya", "Manish", "Tanya", "Suresh", "Deepa", "Harish", "Lakshmi");
    private final List<String> LAST_NAMES = Arrays.asList("Sharma", "Patel", "Singh", "Gupta", "Mehta", "Joshi", "Agarwal", "Verma", "Reddy", "Nair", "Iyer", "Kapoor", "Malhotra", "Chopra", "Bose", "Das", "Pillai", "Shah");
    private final List<String> B2B_COMPANIES = Arrays.asList("TechSoft Solutions", "Bharat Traders Pvt Ltd", "Krishna Exports", "Metro Supplies Co", "Apex Ventures", "Global Infra Ltd", "Prime Logistics", "Zenith Corp", "Sunrise Manufacturing", "Delta Systems");

    @PostConstruct
    public void init() {
        if (transactionRepository.count() == 0) {
            seedData();
        }
    }

    public void seedData() {
        generateTransactions(80, WorkflowType.PAYMENT_DEGRADATION);
        generateTransactions(50, WorkflowType.CHECKOUT_RECOVERY);
        generateTransactions(40, WorkflowType.SUBSCRIPTION_RECOVERY);
        generateTransactions(30, WorkflowType.RECEIVABLES_CHASER);
    }

    private void generateTransactions(int count, WorkflowType workflow) {
        for (int i = 0; i < count; i++) {
            Transaction t = new Transaction();
            String prefix = workflow.name().substring(0, 3).toUpperCase();
            t.setId(prefix + "_" + UUID.randomUUID().toString().substring(0, 10));
            
            boolean isB2B = (workflow == WorkflowType.RECEIVABLES_CHASER);
            t.setB2b(isB2B);

            if (isB2B) {
                t.setCustomerName(B2B_COMPANIES.get(random.nextInt(B2B_COMPANIES.size())));
                t.setCustomerEmail("finance@" + t.getCustomerName().replaceAll("\\s+", "").toLowerCase() + ".com");
            } else {
                t.setCustomerName(FIRST_NAMES.get(random.nextInt(FIRST_NAMES.size())) + " " + LAST_NAMES.get(random.nextInt(LAST_NAMES.size())));
                t.setCustomerEmail(t.getCustomerName().replaceAll("\\s+", "").toLowerCase() + "@gmail.com");
            }
            
            t.setCustomerPhone("+9198" + (10000000 + random.nextInt(90000000)));
            t.setWorkflow(workflow);
            t.setStatus(TransactionStatus.AT_RISK);
            
            // Dates
            t.setCreatedAt(LocalDateTime.now().minusHours(random.nextInt(72)));
            
            // Details based on workflow
            switch (workflow) {
                case PAYMENT_DEGRADATION:
                    t.setAmount(BigDecimal.valueOf(150 + random.nextInt(25000)));
                    t.setFailureReason(getWeightedFailureReasonForDegradation().name());
                    t.setPaymentMethod(getWeightedPaymentMethodForDegradation());
                    break;
                case CHECKOUT_RECOVERY:
                    t.setAmount(BigDecimal.valueOf(500 + random.nextInt(11500)));
                    t.setFailureReason(FailureReason.CHECKOUT_ABANDONED.name());
                    t.setPaymentMethod(getWeightedPaymentMethodForCheckout());
                    t.setDropStep(getWeightedDropStep());
                    break;
                case SUBSCRIPTION_RECOVERY:
                    t.setAmount(BigDecimal.valueOf(299 + random.nextInt(2700)));
                    t.setFailureReason(random.nextInt(100) < 60 ? FailureReason.EMANDATE_NOT_REGISTERED.name() : FailureReason.CARD_EXPIRED.name());
                    t.setPaymentMethod(t.getFailureReason().equals(FailureReason.EMANDATE_NOT_REGISTERED.name()) ? "emandate" : "card_debit");
                    t.setRecurring(true);
                    break;
                case RECEIVABLES_CHASER:
                    t.setAmount(BigDecimal.valueOf(15000 + random.nextInt(70000)));
                    t.setFailureReason(FailureReason.INVOICE_OVERDUE.name());
                    t.setPaymentMethod(random.nextInt(100) < 60 ? "netbanking" : "card_credit");
                    t.setDaysOverdue(getWeightedDaysOverdue());
                    break;
            }
            
            transactionRepository.save(t);
        }
    }
    
    private FailureReason getWeightedFailureReasonForDegradation() {
        int r = random.nextInt(100);
        if (r < 10) return FailureReason.DO_NOT_HONOR;
        if (r < 20) return FailureReason.RISK_THRESHOLD_BREACH;
        
        List<FailureReason> rest = Arrays.asList(FailureReason.INSUFFICIENT_FUNDS, FailureReason.BANK_TIMEOUT, FailureReason.NETWORK_ERROR, FailureReason.CARD_EXPIRED, FailureReason.INVALID_VPA, FailureReason.OTP_TIMEOUT);
        return rest.get(random.nextInt(rest.size()));
    }
    
    private String getWeightedPaymentMethodForDegradation() {
        int r = random.nextInt(100);
        if (r < 35) return "upi";
        if (r < 60) return "card_debit";
        if (r < 80) return "card_credit";
        return "netbanking";
    }
    
    private String getWeightedPaymentMethodForCheckout() {
        int r = random.nextInt(100);
        if (r < 40) return "upi";
        if (r < 75) return "card_credit";
        return "bnpl";
    }
    
    private String getWeightedDropStep() {
        int r = random.nextInt(100);
        if (r < 30) return "address";
        if (r < 80) return "payment";
        return "otp";
    }
    
    private int getWeightedDaysOverdue() {
        int r = random.nextInt(100);
        if (r < 40) return 7 + random.nextInt(8); // 7-14
        if (r < 75) return 15 + random.nextInt(15); // 15-29
        return 30 + random.nextInt(16); // 30-45
    }
}
