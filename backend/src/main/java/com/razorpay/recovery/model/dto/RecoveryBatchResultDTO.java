package com.razorpay.recovery.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecoveryBatchResultDTO {
    private int batchNumber;
    private int processedCount;
    private double amountRecovered;
}
