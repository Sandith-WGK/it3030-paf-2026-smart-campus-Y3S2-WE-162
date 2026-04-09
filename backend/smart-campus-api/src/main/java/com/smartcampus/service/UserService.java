package com.smartcampus.service;

import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(String email, String name, Role role) {
        // Stub user without passport/password since we use Google OAuth
        User user = User.builder()
                .email(email)
                .name(name)
                .role(role != null ? role : Role.USER)
                .provider("GOOGLE")
                .createdAt(Instant.now())
                .build();
        return userRepository.save(user);
    }

    public User updateUserRole(String id, Role role) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(role);
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with id: " + id);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
