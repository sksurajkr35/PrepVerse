package com.prepverse.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepverse.entity.StudyPlan;
import com.prepverse.repository.StudyPlanRepository;
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

/** Persists each user's study-plan config + checklist as validated JSON. */
@RestController
@RequestMapping("/api/study-plan")
public class StudyPlanController {

    private static final int MAX_BYTES = 128 * 1024;

    private final StudyPlanRepository plans;
    private final ObjectMapper mapper;

    public StudyPlanController(StudyPlanRepository plans, ObjectMapper mapper) {
        this.plans = plans;
        this.mapper = mapper;
    }

    /** Returns the saved plan JSON, or 204 when the user never saved one. */
    @GetMapping
    public ResponseEntity<Object> get(Authentication auth) {
        return plans.findById(auth.getName())
            .map(p -> ResponseEntity.ok(parse(p.getData())))
            .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<Object> save(Authentication auth, @RequestBody Map<String, Object> body) {
        String json;
        try {
            json = mapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid study-plan JSON");
        }
        if (json.length() > MAX_BYTES) {
            throw new ResponseStatusException(
                HttpStatus.PAYLOAD_TOO_LARGE, "Study plan is too large (max 128 KB)");
        }
        String userId = auth.getName();
        StudyPlan p = plans.findById(userId).orElseGet(() -> {
            StudyPlan n = new StudyPlan();
            n.setUserId(userId);
            return n;
        });
        p.setData(json);
        plans.save(p);
        return ResponseEntity.ok(parse(json));
    }

    private Object parse(String json) {
        try {
            return mapper.readValue(json == null ? "{}" : json, Object.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY, "Stored study plan is corrupt");
        }
    }
}
