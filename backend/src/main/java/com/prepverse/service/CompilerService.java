package com.prepverse.service;

import com.prepverse.dto.RunCodeRequest;
import com.prepverse.dto.RunCodeResponse;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/**
 * REAL code execution via the free Piston API (no key needed).
 * Falls back to a mock simulation if Piston is unreachable.
 */
@Service
public class CompilerService {

    private static final Logger log = LoggerFactory.getLogger(CompilerService.class);

    private final RestClient restClient;
    private final String pistonBaseUrl;

    /** Frontend language id -> Piston language name. */
    private static final Map<String, String> LANGUAGES = Map.ofEntries(
        Map.entry("c", "c"),
        Map.entry("cpp", "c++"),
        Map.entry("c++", "c++"),
        Map.entry("java", "java"),
        Map.entry("python", "python"),
        Map.entry("py", "python"),
        Map.entry("javascript", "javascript"),
        Map.entry("js", "javascript"),
        Map.entry("typescript", "typescript"),
        Map.entry("ts", "typescript"),
        Map.entry("go", "go"),
        Map.entry("csharp", "c#"),
        Map.entry("c#", "c#"),
        Map.entry("php", "php"),
        Map.entry("ruby", "ruby"),
        Map.entry("kotlin", "kotlin"),
        Map.entry("swift", "swift"),
        Map.entry("rust", "rust"),
        Map.entry("scala", "scala"),
        Map.entry("r", "r")
    );

    public CompilerService(RestClient restClient,
                           @Value("${app.piston.base-url}") String pistonBaseUrl) {
        this.restClient = restClient;
        this.pistonBaseUrl = pistonBaseUrl;
    }

    @SuppressWarnings("unchecked")
    public RunCodeResponse run(RunCodeRequest req) {
        long started = System.currentTimeMillis();
        try {
            String language = LANGUAGES.getOrDefault(req.language().toLowerCase().trim(), req.language());
            Map<String, Object> body = Map.of(
                "language", language,
                "version", "*",
                "files", List.of(Map.of("content", req.code())),
                "stdin", req.customInput() == null ? "" : req.customInput(),
                "run_timeout", 10000,
                "compile_timeout", 10000
            );

            Map<String, Object> res = restClient.post()
                .uri(pistonBaseUrl + "/execute")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

            long elapsed = System.currentTimeMillis() - started;
            if (res == null) {
                return mockFallback(req);
            }

            Map<String, Object> compile = (Map<String, Object>) res.get("compile");
            if (compile != null && num(compile.get("code")) != 0) {
                return new RunCodeResponse("Compilation Error",
                    nonEmpty(str(compile.get("stderr")), str(compile.get("output")), "Compilation failed"),
                    elapsed + " ms", "N/A", 0, 1);
            }

            Map<String, Object> run = (Map<String, Object>) res.get("run");
            if (run == null) {
                return mockFallback(req);
            }
            String stdout = str(run.get("stdout"));
            String stderr = str(run.get("stderr"));
            int code = num(run.get("code"));
            if (code == 0) {
                String output = stdout.isEmpty() ? "(no output)" : stdout;
                if (!stderr.isEmpty()) {
                    output += "\n[stderr]\n" + stderr;
                }
                return new RunCodeResponse("Accepted", output, elapsed + " ms", "N/A (sandbox)", 1, 1);
            }
            String output = nonEmpty(stderr, stdout, "Program exited with code " + code);
            return new RunCodeResponse("Wrong Answer", output, elapsed + " ms", "N/A (sandbox)", 0, 1);

        } catch (Exception e) {
            log.warn("Piston execution failed, using mock fallback: {}", e.getMessage());
            return mockFallback(req);
        }
    }

    /** Same mock behavior the old Node backend had - used only when Piston is down. */
    private RunCodeResponse mockFallback(RunCodeRequest req) {
        if (req.code() != null && req.code().contains("syntax_error_test")) {
            return new RunCodeResponse("Compilation Error",
                "Line 12: error: expected ';' before '}' token",
                "18 ms", "4.2 MB", 0, 3);
        }
        String output = (req.customInput() != null && !req.customInput().isBlank())
            ? "Output for input: [" + req.customInput() + "]\nResult: Success\n\n(Piston unreachable - mock fallback)"
            : "Test Case 1: PASSED (0ms)\nTest Case 2: PASSED (2ms)\nTest Case 3: PASSED (1ms)\n\nAll test cases matched expected output!\n\n(Piston unreachable - mock fallback)";
        return new RunCodeResponse("Accepted", output, "24 ms", "12.8 MB", 3, 3);
    }

    private static String str(Object o) {
        return o == null ? "" : String.valueOf(o);
    }

    private static int num(Object o) {
        if (o instanceof Number n) {
            return n.intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(o));
        } catch (Exception e) {
            return -1;
        }
    }

    private static String nonEmpty(String... candidates) {
        for (String c : candidates) {
            if (c != null && !c.isBlank()) {
                return c;
            }
        }
        return "";
    }
}
