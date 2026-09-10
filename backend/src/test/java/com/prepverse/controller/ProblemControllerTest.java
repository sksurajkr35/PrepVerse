package com.prepverse.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.prepverse.dto.ProblemDto;
import com.prepverse.dto.SubmitResponse;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.Problem;
import com.prepverse.entity.ProblemExample;
import com.prepverse.entity.User;
import com.prepverse.service.JudgingService;
import com.prepverse.service.ProblemService;
import com.prepverse.service.SubmissionService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class ProblemControllerTest {

    @Mock
    SubmissionService submissionService;

    @Mock
    ProblemService problemService;

    @Mock
    JudgingService judgingService;

    private MockMvc mvc;
    private ProblemDto dto;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(
            new ProblemController(submissionService, problemService, judgingService)).build();

        Problem p = new Problem();
        p.setId("p1");
        p.setTitle("Two Sum");
        p.setDifficulty("Easy");
        p.setAcceptanceRate(49.2);
        p.setTopic("Arrays");
        p.setCompanies(List.of("Amazon"));
        p.setStatus("Unsolved");
        p.setDescription("desc");
        p.setExamples(List.of(new ProblemExample("in", "out", null)));
        p.setConstraints(List.of("c1"));
        p.setHints(List.of("h1"));
        p.setExpectedTimeComplexity("O(N)");
        p.setExpectedSpaceComplexity("O(N)");
        p.setStarterCode(Map.of("cpp", "code"));
        p.setDisplayOrder(1);
        dto = ProblemDto.fromEntity(p);
    }

    @Test
    void listReturnsBank() throws Exception {
        when(problemService.listAll()).thenReturn(List.of(dto));

        mvc.perform(get("/api/problems"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value("p1"))
            .andExpect(jsonPath("$[0].title").value("Two Sum"));
    }

    @Test
    void byIdReturnsProblem() throws Exception {
        when(problemService.getById("p1")).thenReturn(dto);

        mvc.perform(get("/api/problems/p1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.difficulty").value("Easy"))
            .andExpect(jsonPath("$.examples[0].output").value("out"));
    }

    @Test
    void submitReturnsVerdict() throws Exception {
        User u = new User();
        u.setId("u1");
        SubmitResponse res = new SubmitResponse("Accepted", 2, 2,
            null, null, null, null, 120L, "All 2 test cases passed!", UserDto.fromEntity(u));
        when(judgingService.submit(eq("u1"), eq("p1"), eq("python"), eq("code"))).thenReturn(res);

        mvc.perform(post("/api/problems/p1/submit")
                .principal(new TestingAuthenticationToken("u1", null))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"language\":\"python\",\"code\":\"code\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.verdict").value("Accepted"))
            .andExpect(jsonPath("$.passedCases").value(2));
    }
}
