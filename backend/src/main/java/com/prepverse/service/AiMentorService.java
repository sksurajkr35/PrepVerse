package com.prepverse.service;

import com.prepverse.dto.AiMentorRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/**
 * AI Mentor backed by the Gemini REST API (same model/prompting as before).
 * Returns structured demo answers when no API key is configured.
 */
@Service
public class AiMentorService {

    private static final Logger log = LoggerFactory.getLogger(AiMentorService.class);

    private static final String DEFAULT_SYSTEM =
        "You are PrepVerse AI Mentor, an expert computer science and placement preparation mentor "
        + "for engineering students. You help with DSA, Aptitude, Core CS (DBMS, OS, CN, OOP), "
        + "System Design, and HR interview prep. Provide concise, clear, structured responses "
        + "with code snippets when needed.";

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public AiMentorService(RestClient restClient,
                           @Value("${app.gemini.api-key:}") String apiKey,
                           @Value("${app.gemini.model:gemini-2.5-flash}") String model) {
        this.restClient = restClient;
        this.apiKey = apiKey;
        this.model = model;
    }

    @SuppressWarnings("unchecked")
    public String ask(AiMentorRequest req) {
        if (apiKey == null || apiKey.isBlank()) {
            return demoResponse(req.prompt());
        }
        try {
            List<Map<String, Object>> contents = new ArrayList<>();
            if (req.history() != null) {
                for (AiMentorRequest.ChatMessage m : req.history()) {
                    String role = "ai".equalsIgnoreCase(m.role()) ? "model" : "user";
                    contents.add(Map.of("role", role,
                        "parts", List.of(Map.of("text", nz(m.content())))));
                }
            }
            contents.add(Map.of("role", "user",
                "parts", List.of(Map.of("text", req.prompt()))));

            String sys = (req.systemInstruction() == null || req.systemInstruction().isBlank())
                ? DEFAULT_SYSTEM : req.systemInstruction();
            Map<String, Object> body = new HashMap<>();
            body.put("contents", contents);
            body.put("system_instruction", Map.of("parts", List.of(Map.of("text", sys))));

            Map<String, Object> res = restClient.post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}",
                    model, apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

            String text = extractText(res);
            if (text == null || text.isBlank()) {
                throw new IllegalStateException("Empty AI response");
            }
            return text;
        } catch (Exception e) {
            log.warn("Gemini call failed: {}", e.getMessage());
            return demoResponse(req.prompt())
                + "\n\n*(Live AI unavailable right now: " + e.getMessage() + ")*";
        }
    }

    @SuppressWarnings("unchecked")
    private static String extractText(Map<String, Object> res) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) res.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return String.valueOf(parts.get(0).get("text"));
        } catch (Exception e) {
            return null;
        }
    }

    private static String demoResponse(String prompt) {
        String shortPrompt = prompt == null ? "" : prompt.substring(0, Math.min(50, prompt.length()));
        return "[PrepVerse AI Demo Response]\n\n"
            + "Great question regarding \"" + shortPrompt + "...\"!\n\n"
            + "Here is a quick structured breakdown:\n"
            + "1. **Core Concept**: Focus on breaking down the problem into sub-problems (time/space efficiency).\n"
            + "2. **Optimal Approach**: For DSA, analyze time complexity (O(N) vs O(N log N)) and edge cases.\n"
            + "3. **Next Steps**: Try implementing this in Code Arena and run test cases.\n\n"
            + "*(Set GEMINI_API_KEY on the Java backend to get live Gemini 2.5 Flash responses!)*";
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }
}
