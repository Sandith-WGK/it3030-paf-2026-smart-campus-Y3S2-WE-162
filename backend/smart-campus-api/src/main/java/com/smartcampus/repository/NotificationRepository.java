package com.smartcampus.repository;

import com.smartcampus.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Get all notifications for a user, newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Count unread — used for the notification badge number in UI
    long countByUserIdAndIsReadFalse(String userId);

    // Delete all notifications for a user (if needed)
    void deleteByUserId(String userId);
}