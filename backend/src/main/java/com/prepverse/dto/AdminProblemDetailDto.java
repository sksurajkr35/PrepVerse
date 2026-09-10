package com.prepverse.dto;

import java.util.List;

/** Admin-only problem view including hidden judge test cases. */
public record AdminProblemDetailDto(
    ProblemDto problem,
    List<TestCaseDto> testCases
) {}
