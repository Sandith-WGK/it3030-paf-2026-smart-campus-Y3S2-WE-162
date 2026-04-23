package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "resource_views")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceView {
    
    @Id
    private String id;
    
    private String userId;
    private String resourceId;
    private String resourceName;
    private String resourceType;
    private String resourceLocation;
    private Integer resourceCapacity;
    private String resourceStatus;
    private String resourceAvailabilityStart;
    private String resourceAvailabilityEnd;
    private String resourceDescription;
    
    private LocalDateTime viewedAt;
}