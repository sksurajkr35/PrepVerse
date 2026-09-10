package com.prepverse.controller;

import com.prepverse.dto.AdminProblemRequest;
import com.prepverse.dto.AdminProblemDetailDto;
import com.prepverse.dto.AdminStatsDto;
import com.prepverse.dto.ProblemDto;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.User;
import com.prepverse.repository.ProblemRepository;
import com.prepverse.repository.SubmissionRepository;
import com.prepverse.repository.TestAttemptRepository;
import com.prepverse.repository.UserRepository;
import com.prepverse.service.ProblemService;
import jakarta.validation.Valid;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Admin portal APIs - every endpoint requires ROLE_ADMIN. */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProblemService problemService;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final TestAttemptRepository testAttemptRepository;

    public AdminController(ProblemService problemService,
                           ProblemRepository problemRepository,
                           UserRepository userRepository,
                           SubmissionRepository submissionRepository,
                           TestAttemptRepository testAttemptRepository) {
        this.problemService = problemService;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.testAttemptRepository = testAttemptRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> stats() {
        return ResponseEntity.ok(new AdminStatsDto(
            userRepository.count(),
            problemRepository.count(),
            submissionRepository.count(),
            testAttemptRepository.count(),
            submissionRepository.countByStatus("Accepted")
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> users() {
        List<UserDto> list = userRepository.findAll().stream()
            .sorted(Comparator.comparingInt(User::getPrepVerseScore).reversed())
            .map(UserDto::fromEntity)
            .toList();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDto> setRole(Authentication auth,
                                           @PathVariable String id,
                                           @RequestBody Map<String, String> body) {
        String role = body == null ? null : body.get("role");
        if (!"student".equals(role) && !"admin".equals(role)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "role must be 'student' or 'admin'");
        }
        if (id.equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot change your own role");
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setRole(role);
        return ResponseEntity.ok(UserDto.fromEntity(userRepository.save(user)));
    }

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemDto>> problems() {
        return ResponseEntity.ok(problemService.listAll());
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<AdminProblemDetailDto> problemDetail(@PathVariable String id) {
        return ResponseEntity.ok(new AdminProblemDetailDto(
            problemService.getById(id),
            problemService.testCasesFor(id)
        ));
    }

    @PostMapping("/problems")
    public ResponseEntity<ProblemDto> createProblem(@Valid @RequestBody AdminProblemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.create(req));
    }

    @PutMapping("/problems/{id}")
    public ResponseEntity<ProblemDto> updateProblem(@PathVariable String id,
                                                    @Valid @RequestBody AdminProblemRequest req) {
        return ResponseEntity.ok(problemService.update(id, req));
    }

    @DeleteMapping("/problems/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable String id) {
        problemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
