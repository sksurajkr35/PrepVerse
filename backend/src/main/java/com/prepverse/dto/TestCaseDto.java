package com.prepverse.dto;

import com.prepverse.entity.TestCase;

/** Judge test case - exposed only through admin endpoints. */
public record TestCaseDto(
    Long id,
    String input,
    String expectedOutput,
    boolean hidden,
    int position
) {

    public static TestCaseDto fromEntity(TestCase t) {
        return new TestCaseDto(
            t.getId(),
            t.getInput(),
            t.getExpectedOutput(),
            t.isHidden(),
            t.getPosition()
        );
    }
}
