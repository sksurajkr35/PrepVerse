package com.prepverse.dto;

import com.prepverse.entity.Problem;
import com.prepverse.entity.ProblemExample;
import java.util.List;
import java.util.Map;

/**
 * Public problem shape - identical to the frontend Problem type.
 * Judge test cases are NEVER included here (see TestCaseDto, admin only).
 */
public record ProblemDto(
    String id,
    String title,
    String difficulty,
    double acceptanceRate,
    String topic,
    List<String> companies,
    String status,
    String description,
    List<ExampleDto> examples,
    List<String> constraints,
    List<String> hints,
    String expectedTimeComplexity,
    String expectedSpaceComplexity,
    Map<String, String> starterCode
) {

    public record ExampleDto(String input, String output, String explanation) {
        static ExampleDto from(ProblemExample e) {
            return new ExampleDto(e.getInput(), e.getOutput(), e.getExplanation());
        }
    }

    public static ProblemDto fromEntity(Problem p) {
        return new ProblemDto(
            p.getId(),
            p.getTitle(),
            p.getDifficulty(),
            p.getAcceptanceRate(),
            p.getTopic() == null ? "" : p.getTopic(),
            p.getCompanies() == null ? List.of() : List.copyOf(p.getCompanies()),
            p.getStatus() == null ? "Unsolved" : p.getStatus(),
            p.getDescription() == null ? "" : p.getDescription(),
            p.getExamples() == null ? List.of()
                : p.getExamples().stream().map(ExampleDto::from).toList(),
            p.getConstraints() == null ? List.of() : List.copyOf(p.getConstraints()),
            p.getHints() == null ? List.of() : List.copyOf(p.getHints()),
            p.getExpectedTimeComplexity() == null ? "" : p.getExpectedTimeComplexity(),
            p.getExpectedSpaceComplexity() == null ? "" : p.getExpectedSpaceComplexity(),
            p.getStarterCode() == null ? Map.of() : Map.copyOf(p.getStarterCode())
        );
    }
}
