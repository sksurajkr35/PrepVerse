package com.prepverse.controller;

import com.prepverse.dto.TestAttemptDto;
import com.prepverse.dto.TestAttemptRequest;
import com.prepverse.service.TestAttemptService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-attempts")
public class TestAttemptController {

    private final TestAttemptService testAttemptService;

    public TestAttemptController(TestAttemptService testAttemptService) {
        this.testAttemptService = testAttemptService;
    }

    @PostMapping
    public ResponseEntity<TestAttemptDto> save(Authentication auth,
                                              @Valid @RequestBody TestAttemptRequest req) {
        return ResponseEntity.ok(testAttemptService.save(auth.getName(), req));
    }

    @GetMapping
    public ResponseEntity<List<TestAttemptDto>> mine(Authentication auth) {
        return ResponseEntity.ok(testAttemptService.listMine(auth.getName()));
    }
}
