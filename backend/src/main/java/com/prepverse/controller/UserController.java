package com.prepverse.controller;

import com.prepverse.dto.UpdateProfileRequest;
import com.prepverse.dto.UserDto;
import com.prepverse.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication auth) {
        return ResponseEntity.ok(userService.getById(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMe(Authentication auth,
                                            @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), req));
    }
}
