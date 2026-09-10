package com.prepverse.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.prepverse.dto.SubmitResponse;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.Problem;
import com.prepverse.entity.TestCase;
import com.prepverse.entity.User;
import com.prepverse.repository.ProblemRepository;
import com.prepverse.repository.TestCaseRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class JudgingServiceTest {

    @Mock
    ProblemRepository problems;

    @Mock
    TestCaseRepository testCases;

    @Mock
    SubmissionService submissions;

    @Mock
    UserService userService;

    @Mock
    CompilerService compiler;

    @InjectMocks
    JudgingService judging;

    private Problem problem;
    private UserDto user;

    @BeforeEach
    void setUp() {
        problem = new Problem();
        problem.setId("p1");
        problem.setTitle("Two Sum");

        User u = new User();
        u.setId("u1");
        u.setEmail("a@b.com");
        user = UserDto.fromEntity(u);
    }

    private static TestCase tc(String input, String expected, boolean hidden, int pos) {
        TestCase t = new TestCase();
        t.setProblemId("p1");
        t.setInput(input);
        t.setExpectedOutput(expected);
        t.setHidden(hidden);
        t.setPosition(pos);
        return t;
    }

    private static CompilerService.Execution ok(String stdout) {
        return new CompilerService.Execution(stdout, "", 0, null, false, "");
    }

    private void givenProblemWith(TestCase... cases) {
        when(problems.findById("p1")).thenReturn(Optional.of(problem));
        when(testCases.findByProblemIdOrderByPositionAsc("p1")).thenReturn(List.of(cases));
        when(userService.getById("u1")).thenReturn(user);
    }

    @Test
    void unsupportedLanguageIs400() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> judging.submit("u1", "p1", "brainfuck", "code"));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void missingProblemIs404() {
        when(problems.findById("p1")).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> judging.submit("u1", "p1", "python", "x"));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void problemWithoutCasesIs422() {
        when(problems.findById("p1")).thenReturn(Optional.of(problem));
        when(testCases.findByProblemIdOrderByPositionAsc("p1")).thenReturn(List.of());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> judging.submit("u1", "p1", "python", "x"));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void allPassingGivesAccepted() {
        givenProblemWith(tc("in1", "0 1", false, 1), tc("in2", "1 2", true, 2));
        when(compiler.execute("python", "code", "in1", 5)).thenReturn(ok("0 1"));
        when(compiler.execute("python", "code", "in2", 5)).thenReturn(ok("1 2\n"));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Accepted", res.verdict());
        assertEquals(2, res.passedCases());
        assertEquals(2, res.totalCases());
        assertNull(res.failedCaseNumber());
        verify(submissions).create(eq("u1"), argThat(req -> "Accepted".equals(req.status())));
    }

    @Test
    void wrongAnswerOnVisibleCaseShowsDetails() {
        givenProblemWith(tc("in1", "0 1", false, 1));
        when(compiler.execute("python", "code", "in1", 5)).thenReturn(ok("9 9"));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Wrong Answer", res.verdict());
        assertEquals(0, res.passedCases());
        assertEquals(1, res.failedCaseNumber());
        assertEquals("in1", res.failedInput());
        assertEquals("0 1", res.failedExpected());
        assertEquals("9 9", res.failedActual());
    }

    @Test
    void wrongAnswerOnHiddenCaseRedactsInputAndExpected() {
        givenProblemWith(tc("secret", "0 1", true, 1));
        when(compiler.execute("python", "code", "secret", 5)).thenReturn(ok("9 9"));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Wrong Answer", res.verdict());
        assertEquals(1, res.failedCaseNumber());
        assertNull(res.failedInput());
        assertNull(res.failedExpected());
        assertEquals("9 9", res.failedActual());
    }

    @Test
    void compileErrorIsTerminal() {
        givenProblemWith(tc("in1", "0 1", false, 1));
        when(compiler.execute("python", "code", "in1", 5))
            .thenReturn(new CompilerService.Execution("", "", 1, null, true, "error: bad syntax"));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Compilation Error", res.verdict());
        assertNull(res.failedCaseNumber());
        assertTrue(res.message().contains("bad syntax"));
    }

    @Test
    void killedProcessIsTle() {
        givenProblemWith(tc("in1", "0 1", false, 1));
        when(compiler.execute("python", "code", "in1", 5))
            .thenReturn(new CompilerService.Execution("", "", null, "SIGKILL", false, ""));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Time Limit Exceeded", res.verdict());
        assertEquals(1, res.failedCaseNumber());
    }

    @Test
    void nonZeroExitIsRuntimeError() {
        givenProblemWith(tc("in1", "0 1", false, 1));
        when(compiler.execute("python", "code", "in1", 5))
            .thenReturn(new CompilerService.Execution("", "boom", 1, null, false, ""));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Runtime Error", res.verdict());
        assertEquals("boom", res.failedActual());
    }

    @Test
    void judgeOutageSavesNothing() {
        givenProblemWith(tc("in1", "0 1", false, 1));
        when(compiler.execute("python", "code", "in1", 5))
            .thenThrow(new RuntimeException("connect timed out"));

        SubmitResponse res = judging.submit("u1", "p1", "python", "code");

        assertEquals("Judge Error", res.verdict());
        verify(submissions, never()).create(any(), any());
    }

    @Test
    void outputComparisonIsLenient() {
        assertTrue(JudgingService.sameOutput("0 1\n", "0 1"));
        assertTrue(JudgingService.sameOutput("0 1\r\n", "0 1"));
        assertTrue(JudgingService.sameOutput("a  \nb", "a\nb"));
        assertTrue(JudgingService.sameOutput("\n0 1\n\n", "0 1"));
        assertFalse(JudgingService.sameOutput("0 2", "0 1"));
    }
}
