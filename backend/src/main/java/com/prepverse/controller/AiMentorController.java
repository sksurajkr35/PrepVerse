package com.prepverse.controller;

import com.prepverse.dto.AiMentorRequest;
import com.prepverse.dto.AiMentorResponse;
import com.prepverse.service.AiMentorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-mentor")
public class AiMentorController {

    private final AiMentorService aiMentorService;

    public AiMentorController(AiMentorService aiMentorService) {
        this.aiMentorService = aiMentorService;
    }

    @PostMapping
    public ResponseEntity<AiMentorResponse> ask(@Valid @RequestBody AiMentorRequest req) {
        return ResponseEntity.ok(new AiMentorResponse(aiMentorService.ask(req)));
    }
}
