package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.dto.UserRequestDto;
import com.example.emploiDuTemps.dto.UserResponseDto;
import com.example.emploiDuTemps.entity.User;
import com.example.emploiDuTemps.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDto register(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.email)) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setNom(dto.nom);
        user.setPrenom(dto.prenom);
        user.setEmail(dto.email);
        user.setPassword(passwordEncoder.encode(dto.password));
        user.setRole(dto.role);
        user.setActive(true);
        user.setCreated_at(LocalDateTime.now());
        user.setUpdate_at(LocalDateTime.now());

        User saved = userRepository.save(user);

        UserResponseDto response = new UserResponseDto();
        response.id = saved.getId();
        response.nom = saved.getNom();
        response.prenom = saved.getPrenom();
        response.email = saved.getEmail();
        response.role = saved.getRole();
        response.isActive = saved.isActive();
        response.create_at = saved.getCreated_at();
        response.update_at = saved.getUpdate_at();
        return response;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
    }
}
