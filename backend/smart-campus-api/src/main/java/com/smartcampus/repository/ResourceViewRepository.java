package com.smartcampus.repository;

import com.smartcampus.model.ResourceView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceViewRepository extends MongoRepository<ResourceView, String> {
    
    List<ResourceView> findByUserIdOrderByViewedAtDesc(String userId);
    
    void deleteByUserIdAndResourceId(String userId, String resourceId);
    
    void deleteAllByUserId(String userId);
}