package com.prepverse.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record AiMentorRequest(
    @NotBlank(message = "prompt is required")
    String prompt,

    List<ChatMessage> history,
    String systemInstruction
) {
    public record ChatMessage(String role, String content) {}
}
