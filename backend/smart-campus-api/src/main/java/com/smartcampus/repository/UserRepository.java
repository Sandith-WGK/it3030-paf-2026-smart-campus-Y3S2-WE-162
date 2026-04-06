package com.smartcampus.repository;

import com.smartcampus.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Find user by email — used during OAuth2 login to check if user exists
    Optional<User> findByEmail(String email);

    // Check if email already registered
    boolean existsByEmail(String email);
}