package com.prepverse.dto;

public record AuthResponse(
    String token,
    UserDto user
) {}
