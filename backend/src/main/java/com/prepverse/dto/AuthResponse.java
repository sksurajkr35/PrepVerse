package com.prepverse.dto;

public record AuthResponse(
    String token,
    String refreshToken,
    UserDto user
) {}
