package com.prepverse.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepverse.entity.ResumeProfile;
import com.prepverse.repository.ResumeProfileRepository;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Persists each user's resume builder state as validated JSON. */
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private static final int MAX_BYTES = 128 * 1024;

    private final ResumeProfileRepository profiles;
    private final ObjectMapper mapper;

    public ResumeController(ResumeProfileRepository profiles, ObjectMapper mapper) {
        this.profiles = profiles;
        this.mapper = mapper;
    }

    /** Returns the saved resume JSON, or 204 when the user never saved one. */
    @GetMapping
    public ResponseEntity<Object> get(Authentication auth) {
        return profiles.findById(auth.getName())
            .map(p -> ResponseEntity.ok(parse(p.getData())))
            .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<Object> save(Authentication auth, @RequestBody Map<String, Object> body) {
        String json = serialize(body, "resume");
        if (json.length() > MAX_BYTES) {
            throw new ResponseStatusException(
                HttpStatus.PAYLOAD_TOO_LARGE, "Resume is too large (max 128 KB)");
        }
        String userId = auth.getName();
        ResumeProfile p = profiles.findById(userId).orElseGet(() -> {
            ResumeProfile n = new ResumeProfile();
            n.setUserId(userId);
            return n;
        });
        p.setData(json);
        profiles.save(p);
        return ResponseEntity.ok(parse(json));
    }

    private String serialize(Map<String, Object> body, String what) {
        try {
            return mapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid " + what + " JSON");
        }
    }

    private Object parse(String json) {
        try {
            return mapper.readValue(json == null ? "{}" : json, Object.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY, "Stored resume is corrupt");
        }
    }
}
