package com.prepverse.service;

import com.prepverse.dto.SubmissionRequest;
import com.prepverse.dto.SubmitResponse;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.Problem;
import com.prepverse.entity.TestCase;
import com.prepverse.repository.ProblemRepository;
import com.prepverse.repository.TestCaseRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Real online-judge engine: runs a submission against every test case
 * (visible + hidden) via Piston and returns an honest verdict.
 * Hidden test case input/output is NEVER included in the response.
 */
@Service
public class JudgingService {

    private static final Logger log = LoggerFactory.getLogger(JudgingService.class);

    private final ProblemRepository problems;
    private final TestCaseRepository testCases;
    private final SubmissionService submissions;
    private final UserService userService;
    private final CompilerService compiler;

    public JudgingService(ProblemRepository problems,
                          TestCaseRepository testCases,
                          SubmissionService submissions,
                          UserService userService,
                          CompilerService compiler) {
        this.problems = problems;
        this.testCases = testCases;
        this.submissions = submissions;
        this.userService = userService;
        this.compiler = compiler;
    }

    public SubmitResponse submit(String userId, String problemId, String language, String code) {
        if (!CompilerService.isSupportedLanguage(language)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported language: " + language);
        }
        Problem problem = problems.findById(problemId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
        List<TestCase> cases = testCases.findByProblemIdOrderByPositionAsc(problemId);
        if (cases.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY, "This problem has no test cases configured yet");
        }

        long started = System.currentTimeMillis();
        int passed = 0;
        TestCase firstFailed = null;
        String firstActual = null;
        TestCase current = null;
        String terminalVerdict = null;
        String terminalDetail = null;

        for (TestCase tc : cases) {
            current = tc;
            CompilerService.Execution exec;
            try {
                exec = compiler.execute(language, code,
                    tc.getInput() == null ? "" : tc.getInput(), 5);
            } catch (Exception ex) {
                // Judge itself is down - honest error, NOTHING is saved or scored.
                log.warn("Judge unavailable during submit: {}", ex.getMessage());
                return new SubmitResponse("Judge Error", passed, cases.size(),
                    null, null, null, null,
                    System.currentTimeMillis() - started,
                    "Code judge is unreachable right now - please retry in a moment. Nothing was saved.",
                    userService.getById(userId));
            }

            if (exec.compileError()) {
                terminalVerdict = "Compilation Error";
                terminalDetail = exec.compileOutput();
                break;
            }
            if (exec.exitCode() == null) {
                terminalVerdict = "Time Limit Exceeded";
                terminalDetail = "Program exceeded the 5 second time limit.";
                break;
            }
            if (exec.exitCode() != 0) {
                terminalVerdict = "Runtime Error";
                terminalDetail = nonEmpty(exec.stderr(), exec.stdout(),
                    "Program crashed (exit code " + exec.exitCode() + ").");
                break;
            }
            if (sameOutput(exec.stdout(), tc.getExpectedOutput())) {
                passed++;
            } else if (firstFailed == null) {
                firstFailed = tc;
                firstActual = exec.stdout();
            }
        }

        long elapsed = System.currentTimeMillis() - started;
        String verdict;
        String message;
        if (terminalVerdict != null) {
            verdict = terminalVerdict;
            message = terminalDetail;
        } else if (passed == cases.size()) {
            verdict = "Accepted";
            message = "All " + cases.size() + " test cases passed!";
        } else {
            verdict = "Wrong Answer";
            message = "Passed " + passed + " / " + cases.size() + " test cases.";
        }

        // Persist the attempt (auto-marks solved + bumps score when Accepted).
        submissions.create(userId, new SubmissionRequest(
            problemId, problem.getTitle(), language, code, verdict,
            elapsed + " ms", "N/A (sandbox)", message));
        UserDto user = userService.getById(userId);

        Integer failedNo = null;
        String failedInput = null;
        String failedExpected = null;
        String failedActual = null;
        TestCase failedCase = firstFailed != null ? firstFailed : current;
        if (firstFailed != null) {
            failedNo = firstFailed.getPosition();
            failedActual = firstActual == null ? "" : firstActual;
            if (!firstFailed.isHidden()) {
                failedInput = firstFailed.getInput();
                failedExpected = firstFailed.getExpectedOutput();
            }
        } else if (terminalVerdict != null && !"Compilation Error".equals(terminalVerdict)
                && failedCase != null) {
            failedNo = failedCase.getPosition();
            if ("Runtime Error".equals(terminalVerdict)) {
                failedActual = terminalDetail;
            }
        }

        return new SubmitResponse(verdict, passed, cases.size(),
            failedNo, failedInput, failedExpected, failedActual,
            elapsed, message, user);
    }

    /**
     * Lenient comparison: CRLF/CR normalized, trailing whitespace ignored
     * per line, leading/trailing blank lines ignored.
     */
    static String normalize(String s) {
        if (s == null) {
            return "";
        }
        String unix = s.replace("\r\n", "\n").replace("\r", "\n");
        String[] lines = unix.split("\n", -1);
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            if (sb.length() > 0) {
                sb.append('\n');
            }
            sb.append(line.stripTrailing());
        }
        return sb.toString().strip();
    }

    static boolean sameOutput(String actual, String expected) {
        return normalize(actual).equals(normalize(expected));
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
