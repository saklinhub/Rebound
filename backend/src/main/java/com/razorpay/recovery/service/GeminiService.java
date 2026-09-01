package com.razorpay.recovery.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.recovery.model.dto.AgentDecisionDTO;
import com.razorpay.recovery.model.dto.TransactionDTO;
import com.razorpay.recovery.model.entity.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.timeout-seconds:30}")
    private int timeoutSeconds;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();

    public AgentDecisionDTO callGemini(Transaction t, List<String> allowedInterventions, String stoppingRules, String geminiApiKey) throws Exception {
        return performCall(t, allowedInterventions, stoppingRules, geminiApiKey, 0);
    }

    private AgentDecisionDTO performCall(Transaction t, List<String> allowedInterventions, String stoppingRules, String geminiApiKey, int attempt) throws Exception {
        String systemPrompt = """
            You are a senior revenue recovery AI agent for an Indian fintech platform integrated with Razorpay. You analyze failed payment transactions and determine the optimal recovery intervention with deep reasoning.
            You must:
            - Diagnose the actual root cause, not just restate the failure code
            - Choose ONLY from the allowed interventions list
            - Respect all stopping rules strictly
            - Write customer messages in natural Hinglish for consumers (warm, not pushy), formal English for B2B (professional, specific about amounts and dates)
            - Keep customer messages under 160 characters (SMS-safe)
            - Flag risk_flag=true for any fraud signals, unusual patterns, or when human judgment is required
            Respond with ONLY valid JSON. No markdown. No explanation outside JSON.
            """;

        String userPrompt = String.format("""
            Analyze this failed transaction and recommend the optimal recovery action.

            TRANSACTION:
            %s

            ALLOWED INTERVENTIONS (choose exactly one):
            %s

            STOPPING RULES TO ENFORCE:
            %s

            ADDITIONAL CONTEXT:
            - Workflow: %s
            - Retry count so far: %d
            - Customer touches so far: %d
            - B2B transaction: %s
            - Recurring payment: %s
            %s

            Respond with ONLY this JSON:
            {
              "diagnosis": "specific root cause in one sentence — not just the failure code",
              "intervention": "EXACT_CODE from allowed interventions",
              "reasoning": "why this specific intervention for this specific case (2 sentences)",
              "confidence": integer 0-100,
              "risk_flag": true/false,
              "message_to_customer": "actual message to send — Hinglish for consumer, formal English for B2B, under 160 chars",
              "estimated_recovery_probability": float 0.0-1.0
            }
            """,
            objectMapper.writeValueAsString(t),
            String.join(", ", allowedInterventions),
            stoppingRules,
            t.getWorkflow().name(),
            t.getRetryCount(),
            t.getTouches(),
            t.isB2b(),
            t.isRecurring(),
            t.getDaysOverdue() != null ? "Days overdue: " + t.getDaysOverdue() : ""
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("role", "user", "parts", List.of(
                Map.of("text", systemPrompt + "\\n\\n" + userPrompt)
            ))
        ));
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        generationConfig.put("temperature", 0.2);
        generationConfig.put("maxOutputTokens", 500);
        generationConfig.put("topP", 0.8);
        requestBody.put("generationConfig", generationConfig);

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(geminiApiUrl + "?key=" + geminiApiKey))
                .timeout(Duration.ofSeconds(timeoutSeconds))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                log.error("Gemini API error: {}", response.body());
                throw new Exception("Gemini API error: " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            String responseText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Allow caller to fetch raw response if needed, for simplicity we directly parse here.
            // If responseText is markdown wrapped, clean it
            if (responseText.startsWith("```json")) {
                responseText = responseText.replace("```json", "").replace("```", "").trim();
            }

            AgentDecisionDTO decision = objectMapper.readValue(responseText, AgentDecisionDTO.class);
            return decision;

        } catch (Exception e) {
            if (attempt == 0) {
                log.warn("First Gemini call failed, retrying...", e);
                Thread.sleep(1000);
                return performCall(t, allowedInterventions, stoppingRules, geminiApiKey, 1);
            }
            throw new RuntimeException("GeminiApiException: Failed after 2 attempts", e);
        }
    }
}
