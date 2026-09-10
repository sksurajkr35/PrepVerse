package com.prepverse.service;

import com.prepverse.dto.MarkSolvedRequest;
import com.prepverse.dto.SubmissionDto;
import com.prepverse.dto.SubmissionRequest;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.Submission;
import com.prepverse.entity.User;
import com.prepverse.repository.SubmissionRepository;
import com.prepverse.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SubmissionService {

    private final SubmissionRepository submissions;
    private final UserRepository users;

    public SubmissionService(SubmissionRepository submissions, UserRepository users) {
        this.submissions = submissions;
        this.users = users;
    }

    /** Saves a submission; Accepted ones also count as solved + bump score/XP. */
    @Transactional
    public SubmissionDto create(String userId, SubmissionRequest req) {
        users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Submission s = new Submission();
        s.setId("sub_" + UUID.randomUUID().toString().substring(0, 8));
        s.setUserId(userId);
        s.setProblemId(req.problemId());
        s.setProblemTitle(req.problemTitle() == null ? "" : req.problemTitle());
        s.setLanguage(req.language());
        s.setCode(req.code() == null ? "" : req.code());
        s.setStatus(req.status() == null || req.status().isBlank() ? "Accepted" : req.status());
        s.setRuntime(req.runtime() == null ? "N/A" : req.runtime());
        s.setMemory(req.memory() == null ? "N/A" : req.memory());
        submissions.save(s);

        if ("Accepted".equalsIgnoreCase(s.getStatus())) {
            applySolved(userId, req.problemId());
        }
        return SubmissionDto.fromEntity(s);
    }

    /** Marks a problem solved and updates score / XP / readiness. */
    @Transactional
    public UserDto markSolved(String userId, MarkSolvedRequest req) {
        User u = applySolved(userId, req.problemId());
        return UserDto.fromEntity(u);
    }

    @Transactional(readOnly = true)
    public List<SubmissionDto> listMine(String userId) {
        return submissions.findByUserIdOrderBySubmittedAtDesc(userId).stream()
            .map(SubmissionDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<String> solvedIds(String userId) {
        User u = users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return List.copyOf(u.getSolvedProblemIds());
    }

    private User applySolved(String userId, String problemId) {
        User u = users.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (u.getSolvedProblemIds().add(problemId)) {
            u.setProblemsSolved(u.getSolvedProblemIds().size());
            u.setPrepVerseScore(Math.min(1000, u.getPrepVerseScore() + 5));
            u.setPlacementReadiness(Math.min(100, u.getPrepVerseScore() / 10));
            u.setXp(u.getXp() + 100);
            users.save(u);
        }
        return u;
    }
}
