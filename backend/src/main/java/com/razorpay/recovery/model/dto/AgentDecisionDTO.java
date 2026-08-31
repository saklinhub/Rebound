package com.razorpay.recovery.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentDecisionDTO {
    private String diagnosis;
    private String intervention;
    private String reasoning;
    private Integer confidence;
    
    @JsonProperty("risk_flag")
    private boolean riskFlag;
    
    @JsonProperty("message_to_customer")
    private String messageToCustomer;
    
    @JsonProperty("estimated_recovery_probability")
    private Double estimatedRecoveryProbability;
}
