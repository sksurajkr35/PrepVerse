package com.prepverse.security;

import com.prepverse.entity.User;
import com.prepverse.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Loads a User from MySQL by id (the JWT subject) for Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        String role = "ROLE_" + (user.getRole() == null ? "STUDENT" : user.getRole().toUpperCase());
        return new org.springframework.security.core.userdetails.User(
            user.getId(),
            user.getPasswordHash() == null ? "" : user.getPasswordHash(),
            List.of(new SimpleGrantedAuthority(role))
        );
    }
}
