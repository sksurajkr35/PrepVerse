package com.prepverse.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.prepverse.dto.AuthResponse;
import com.prepverse.dto.LoginRequest;
import com.prepverse.dto.RegisterRequest;
import com.prepverse.dto.UserDto;
import com.prepverse.entity.User;
import com.prepverse.service.AuthService;
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
class AuthControllerTest {

    @Mock
    AuthService authService;

    private MockMvc mvc;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new AuthController(authService)).build();
        User u = new User();
        u.setId("u1");
        u.setName("A");
        u.setEmail("a@b.com");
        authResponse = new AuthResponse("access", "refresh", UserDto.fromEntity(u));
    }

    @Test
    void loginReturnsPair() throws Exception {
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"password\":\"pw\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("access"))
            .andExpect(jsonPath("$.refreshToken").value("refresh"))
            .andExpect(jsonPath("$.user.id").value("u1"));
    }

    @Test
    void registerReturns201() throws Exception {
        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"A\",\"email\":\"a@b.com\",\"password\":\"password123\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").value("access"));
    }

    @Test
    void refreshReturnsFreshPair() throws Exception {
        when(authService.refresh("rt")).thenReturn(authResponse);

        mvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"refreshToken\":\"rt\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.refreshToken").value("refresh"));
    }

    @Test
    void logoutRevokesAndReturns204() throws Exception {
        mvc.perform(post("/api/auth/logout")
                .principal(new TestingAuthenticationToken("u1", null)))
            .andExpect(status().isNoContent());

        verify(authService).logout("u1");
    }
}
