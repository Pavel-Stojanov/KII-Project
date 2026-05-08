package mk.ukim.finki.library_api.web.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.User;
import mk.ukim.finki.library_api.model.enums.Role;
import mk.ukim.finki.library_api.repository.UserRepository;
import mk.ukim.finki.library_api.config.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder; 

    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String token, String username, Role role) {}
    public record RegisterRequest(String username, String password, String name, String surname) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Корисникот не е пронајден"));
        String jwtToken = jwtService.generateToken(Map.of("role", user.getRole().name()), user);
        return ResponseEntity.ok(new LoginResponse(jwtToken, user.getUsername(), user.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setSurname(request.surname());
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);
        
        String jwtToken = jwtService.generateToken(Map.of("role", user.getRole().name()), user);
        return ResponseEntity.ok(new LoginResponse(jwtToken, user.getUsername(), user.getRole()));
    }
}
