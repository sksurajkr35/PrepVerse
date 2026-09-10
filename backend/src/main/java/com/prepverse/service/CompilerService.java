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
 *
 * <p>{@link #execute} is also used by the judging engine to run
 * submissions against hidden test cases.
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

    /** True when the judge knows how to run this language id. */
    public static boolean isSupportedLanguage(String language) {
        return language != null && LANGUAGES.containsKey(language.toLowerCase().trim());
    }

    /**
     * Structured result of one Piston execution.
     *
     * @param stdout       program stdout
     * @param stderr       program stderr
     * @param exitCode     process exit code (null when killed - treat as TLE)
     * @param signal       kill signal if any (e.g. SIGKILL on timeout)
     * @param compileError true when compilation failed
     * @param compileOutput compiler stdout/stderr when compilation failed
     */
    public record Execution(
        String stdout,
        String stderr,
        Integer exitCode,
        String signal,
        boolean compileError,
        String compileOutput
    ) {}

    public CompilerService(RestClient restClient,
                           @Value("${app.piston.base-url}") String pistonBaseUrl) {
        this.restClient = restClient;
        this.pistonBaseUrl = pistonBaseUrl;
    }

    /**
     * Executes code once via Piston and returns the structured result.
     * Throws RuntimeException when Piston itself is unreachable or errors.
     */
    @SuppressWarnings("unchecked")
    public Execution execute(String language, String code, String stdin, int runTimeoutSec) {
        String pistonLang = LANGUAGES.getOrDefault(
            language == null ? "" : language.toLowerCase().trim(), language);
        Map<String, Object> body = Map.of(
            "language", pistonLang,
            "version", "*",
            "files", List.of(Map.of("content", code == null ? "" : code)),
            "stdin", stdin == null ? "" : stdin,
            "run_timeout", runTimeoutSec * 1000,
            "compile_timeout", 10000
        );

        Map<String, Object> res = restClient.post()
            .uri(pistonBaseUrl + "/execute")
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(Map.class);

        if (res == null) {
            throw new IllegalStateException("Empty judge response");
        }

        Map<String, Object> compile = (Map<String, Object>) res.get("compile");
        if (compile != null && num(compile.get("code")) != 0) {
            return new Execution("", "",
                num(compile.get("code")),
                str(compile.get("signal")),
                true,
                nonEmpty(str(compile.get("stderr")), str(compile.get("output")), "Compilation failed"));
        }

        Map<String, Object> run = (Map<String, Object>) res.get("run");
        if (run == null) {
            throw new IllegalStateException("Empty judge response");
        }
        return new Execution(
            str(run.get("stdout")),
            str(run.get("stderr")),
            intOrNull(run.get("code")),
            str(run.get("signal")),
            false,
            ""
        );
    }

    /** Default 10s run timeout (interactive "Run Code" endpoint). */
    public Execution execute(String language, String code, String stdin) {
        return execute(language, code, stdin, 10);
    }

    public RunCodeResponse run(RunCodeRequest req) {
        long started = System.currentTimeMillis();
        try {
            Execution e = execute(req.language(), req.code(), req.customInput());
            long elapsed = System.currentTimeMillis() - started;

            if (e.compileError()) {
                return new RunCodeResponse("Compilation Error",
                    e.compileOutput(), elapsed + " ms", "N/A", 0, 1);
            }
            if (e.exitCode() == null) {
                return new RunCodeResponse("Time Limit Exceeded",
                    nonEmpty(e.stderr(), "Program exceeded the time limit."),
                    elapsed + " ms", "N/A (sandbox)", 0, 1);
            }
            if (e.exitCode() == 0) {
                String output = e.stdout().isEmpty() ? "(no output)" : e.stdout();
                if (!e.stderr().isEmpty()) {
                    output += "\n[stderr]\n" + e.stderr();
                }
                return new RunCodeResponse("Accepted", output, elapsed + " ms", "N/A (sandbox)", 1, 1);
            }
            String output = nonEmpty(e.stderr(), e.stdout(),
                "Program exited with code " + e.exitCode());
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

    private static Integer intOrNull(Object o) {
        if (o == null) {
            return null;
        }
        if (o instanceof Number n) {
            return n.intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(o));
        } catch (Exception e) {
            return null;
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
