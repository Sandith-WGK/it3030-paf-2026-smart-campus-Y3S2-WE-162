package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;

    private String picture; // Google profile photo URL

    private String provider; // "GOOGLE" or "LOCAL"

    private String password; // Hashed password for local auth

    @Builder.Default
    private Role role = Role.USER; // default role for new users

    @Builder.Default
    private boolean enabled = false; // user must verify email to be enabled

    private String verificationCode;

    private String resetCode;
    private Instant resetCodeExpiresAt;

    @CreatedDate
    private Instant createdAt;
}