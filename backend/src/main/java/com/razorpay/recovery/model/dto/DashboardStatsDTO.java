package com.razorpay.recovery.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private double totalAtRisk;
    private double totalRecovered;
    private double totalFailed;
    private double totalEscalated;
    private double recoveryRate;
    private Map<String, Long> countByStatus;
    private Map<String, Long> countByWorkflow;
    private Map<String, Double> recoveredByWorkflow;
    private Map<String, Double> atRiskByWorkflow;
    private long riskFlagCount;
    private long totalProcessed;
    private List<TimelinePoint> recoveryTimeline;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TimelinePoint {
        private int batchNumber;
        private double cumulativeRecovered;
        private String timestamp;
    }
}
