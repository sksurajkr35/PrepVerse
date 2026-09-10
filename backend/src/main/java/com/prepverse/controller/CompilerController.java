package com.prepverse.controller;

import com.prepverse.dto.RunCodeRequest;
import com.prepverse.dto.RunCodeResponse;
import com.prepverse.service.CompilerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/compiler")
public class CompilerController {

    private final CompilerService compilerService;

    public CompilerController(CompilerService compilerService) {
        this.compilerService = compilerService;
    }

    @PostMapping("/run")
    public ResponseEntity<RunCodeResponse> run(@Valid @RequestBody RunCodeRequest req) {
        return ResponseEntity.ok(compilerService.run(req));
    }
}
