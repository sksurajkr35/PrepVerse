package com.prepverse.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

/** Create/update payload for a problem in the question bank (admin only). */
public record AdminProblemRequest(
    @NotBlank(message = "title is required")
    @Size(max = 200, message = "title is too long")
    String title,

    String topic,

    @Pattern(regexp = "Easy|Medium|Hard", message = "difficulty must be Easy, Medium or Hard")
    String difficulty,

    double acceptanceRate,
    String description,
    List<String> companies,
    List<String> constraints,
    List<String> hints,
    String expectedTimeComplexity,
    String expectedSpaceComplexity,
    Map<String, String> starterCode,
    List<ExampleInput> examples,

    @Valid
    List<CaseInput> testCases
) {

    public record ExampleInput(String input, String output, String explanation) {}

    public record CaseInput(
        String input,
        String expectedOutput,
        boolean hidden
    ) {}
}
