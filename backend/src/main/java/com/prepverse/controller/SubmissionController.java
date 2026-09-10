package com.prepverse.controller;

import com.prepverse.dto.SubmissionDto;
import com.prepverse.dto.SubmissionRequest;
import com.prepverse.service.SubmissionService;
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
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    public ResponseEntity<SubmissionDto> create(Authentication auth,
                                               @Valid @RequestBody SubmissionRequest req) {
        return ResponseEntity.ok(submissionService.create(auth.getName(), req));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SubmissionDto>> mine(Authentication auth) {
        return ResponseEntity.ok(submissionService.listMine(auth.getName()));
    }
}
