package com.smartcampus.service;

import com.smartcampus.model.Resource;
import com.smartcampus.model.ResourceView;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.ResourceViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceViewService {
    
    private final ResourceViewRepository resourceViewRepository;
    private final ResourceRepository resourceRepository;
    private static final int MAX_ITEMS = 5;
    
    public void addRecentlyViewed(String userId, String resourceId) {
        if (userId == null || resourceId == null) {
            log.warn("Cannot add recently viewed: userId or resourceId is null");
            return;
        }
        
        Resource resource = resourceRepository.findById(resourceId).orElse(null);
        if (resource == null) {
            log.warn("Resource not found with id: {}", resourceId);
            return;
        }
        
        // Remove existing entry to move to front
        resourceViewRepository.deleteByUserIdAndResourceId(userId, resourceId);
        
        // Create new view entry
        ResourceView view = ResourceView.builder()
                .userId(userId)
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .resourceType(resource.getType().name())
                .resourceLocation(resource.getLocation())
                .resourceCapacity(resource.getCapacity())
                .resourceStatus(resource.getStatus().name())
                .resourceAvailabilityStart(resource.getAvailabilityStart() != null ? resource.getAvailabilityStart().toString() : null)
                .resourceAvailabilityEnd(resource.getAvailabilityEnd() != null ? resource.getAvailabilityEnd().toString() : null)
                .resourceDescription(resource.getDescription())
                .viewedAt(LocalDateTime.now())
                .build();
        
        resourceViewRepository.save(view);
        
        // Keep only last 5
        List<ResourceView> userViews = resourceViewRepository.findByUserIdOrderByViewedAtDesc(userId);
        if (userViews.size() > MAX_ITEMS) {
            List<ResourceView> toDelete = userViews.subList(MAX_ITEMS, userViews.size());
            resourceViewRepository.deleteAll(toDelete);
        }
        
        log.info("Added resource '{}' to recently viewed for user {}", resource.getName(), userId);
    }
    
    public List<ResourceView> getRecentlyViewed(String userId) {
        return resourceViewRepository.findByUserIdOrderByViewedAtDesc(userId);
    }
    
    public void clearRecentlyViewed(String userId) {
        resourceViewRepository.deleteAllByUserId(userId);
        log.info("Cleared recently viewed for user {}", userId);
    }
    
    public void removeFromRecentlyViewed(String userId, String resourceId) {
        resourceViewRepository.deleteByUserIdAndResourceId(userId, resourceId);
        log.info("Removed resource {} from recently viewed for user {}", resourceId, userId);
    }
}