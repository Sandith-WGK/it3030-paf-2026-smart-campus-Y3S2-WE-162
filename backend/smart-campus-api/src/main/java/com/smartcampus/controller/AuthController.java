package com.smartcampus.controller;

import com.smartcampus.dto.AuthResponse;
import com.smartcampus.dto.ForgotPasswordRequest;
import com.smartcampus.dto.LoginRequest;
import com.smartcampus.dto.ResetPasswordRequest;
import com.smartcampus.dto.SignupRequest;
import com.smartcampus.dto.VerifyRequest;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtProvider;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        String role = userPrincipal.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        return ResponseEntity.ok(new AuthResponse(jwt, userPrincipal.getUsername(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        String email = signupRequest.getEmail().toLowerCase();
        
        if(userRepository.existsByEmail(email)) {
            User existingUser = userRepository.findByEmail(email).orElse(null);
            if(existingUser != null && existingUser.isEnabled()) {
                return ResponseEntity.badRequest().body("Error: Email is already registered and verified.");
            }
            // If user exists but is NOT enabled, we'll allow them to "re-register" (update code)
        }

        // Generate 6-digit verification code
        String verificationCode = String.valueOf((int)((Math.random() * 900000) + 100000));

        // Create or update user account (disabled by default)
        User user = userRepository.findByEmail(email).orElse(new User());
        user.setName(signupRequest.getName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setProvider("LOCAL");
        user.setRole(Role.USER);
        user.setEnabled(false);
        user.setVerificationCode(verificationCode);

        userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (Exception e) {
            // Log the error but keep the user record (they can request resend later)
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
        
        return ResponseEntity.ok("Registration successful. Please check your email for verification code.");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyRequest verifyRequest) {
        String email = verifyRequest.getEmail().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Error: Account is already verified.");
        }

        if (user.getVerificationCode() != null && user.getVerificationCode().equals(verifyRequest.getCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null); // Clear the code
            userRepository.save(user);
            return ResponseEntity.ok("Account verified successfully. You can now log in.");
        } else {
            return ResponseEntity.badRequest().body("Error: Invalid verification code.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Return success even if not found for security (obscurity)
            return ResponseEntity.ok("If an account exists for " + email + ", you will receive a reset code.");
        }

        String resetCode = String.valueOf((int)((Math.random() * 900000) + 100000));
        user.setResetCode(resetCode);
        user.setResetCodeExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES));
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
        } catch (Exception e) {
            System.err.println("Failed to send reset email: " + e.getMessage());
        }

        return ResponseEntity.ok("Password reset code has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found.");
        }

        if (user.getResetCode() == null || !user.getResetCode().equals(request.getCode())) {
            return ResponseEntity.badRequest().body("Error: Invalid reset code.");
        }

        if (user.getResetCodeExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body("Error: Reset code has expired.");
        }

        // Update password and clear reset fields
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetCode(null);
        user.setResetCodeExpiresAt(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully. You can now log in.");
    }
}
