package com.smartcampus.controller;

import com.smartcampus.model.ResourceView;
import com.smartcampus.service.ResourceViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recently-viewed")
@RequiredArgsConstructor
public class ResourceViewController {
    
    private final ResourceViewService resourceViewService;
    
    @GetMapping
    public ResponseEntity<List<ResourceView>> getRecentlyViewed(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(resourceViewService.getRecentlyViewed(userId));
    }
    
    @PostMapping("/{resourceId}")
    public ResponseEntity<?> addRecentlyViewed(
            @PathVariable String resourceId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        resourceViewService.addRecentlyViewed(userId, resourceId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping
    public ResponseEntity<?> clearRecentlyViewed(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        resourceViewService.clearRecentlyViewed(userId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<?> removeFromRecentlyViewed(
            @PathVariable String resourceId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        resourceViewService.removeFromRecentlyViewed(userId, resourceId);
        return ResponseEntity.ok().build();
    }
}