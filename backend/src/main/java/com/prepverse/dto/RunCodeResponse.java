package com.prepverse.dto;

public record RunCodeResponse(
    String status,
    String output,
    String executionTime,
    String memory,
    int passedCases,
    int totalCases
) {}
