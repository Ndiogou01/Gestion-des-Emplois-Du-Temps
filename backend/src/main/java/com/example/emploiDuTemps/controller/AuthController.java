package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.*;
import com.example.emploiDuTemps.service.*;
import com.example.emploiDuTemps.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;

    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email, request.password)
        );

        UserDetails user = (UserDetails) auth.getPrincipal();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestBody RefreshRequest request) {
        System.out.println("Refresh reçu: " + request.getRefreshToken());

        String username = jwtService.extractUsername(request.getRefreshToken());
        System.out.println("Username extrait: " + username);

        UserDetails user = userService.loadUserByUsername(username);

        boolean valid = jwtService.validateToken(request.getRefreshToken(), user);
        System.out.println("Token valide? " + valid);

        if (!valid) {
            throw new RuntimeException("Refresh token invalide ou expiré");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        return new AuthResponse(newAccessToken, request.getRefreshToken());
    }
}
