package com.smartcampus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Smart Campus Hub - Email Verification");
        message.setText("Welcome to Smart Campus Operations Hub!\n\n" +
                "Your verification code is: " + code + "\n\n" +
                "Please enter this code on the registration page to activate your account.\n" +
                "If you did not request this, please ignore this email.");
        
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Smart Campus Hub - Password Reset Request");
        message.setText("We received a request to reset your password for your Smart Campus Hub account.\n\n" +
                "Your password reset code is: " + code + "\n\n" +
                "This code is valid for 15 minutes. If you did not request this, please ignore this email.\n" +
                "Do not share this code with anyone.");
        
        mailSender.send(message);
    }
}
