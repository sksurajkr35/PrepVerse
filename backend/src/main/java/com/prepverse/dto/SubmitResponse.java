package com.prepverse.dto;

/**
 * Judge verdict for a submission. Hidden test case input/output is never
 * included (failedInput/failedExpected are null for hidden cases).
 */
public record SubmitResponse(
    /** Accepted | Wrong Answer | Time Limit Exceeded | Compilation Error | Runtime Error | Judge Error */
    String verdict,
    int passedCases,
    int totalCases,
    /** 1-based number of the first failed case (null when all pass). */
    Integer failedCaseNumber,
    /** First failed case input (null when hidden or when all pass). */
    String failedInput,
    /** First failed case expected output (null when hidden or all pass). */
    String failedExpected,
    /** Your program's output on the first failed case (null when all pass). */
    String failedActual,
    long executionTimeMs,
    String message,
    /** Updated profile (score/XP bumped when Accepted). */
    UserDto user
) {}
