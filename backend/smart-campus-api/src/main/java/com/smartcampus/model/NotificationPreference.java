package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * VIVA PREP: Notification Categories Model.
 * This class defines the 5 notification category toggles shown on the Settings page (frontend/src/pages/Settings.jsx).
 * Each boolean field maps to one of the category cards the user can toggle ON/OFF:
 *   - bookings:      "Booking Updates"      (Confirmations, approvals & rejections)
 *   - tickets:       "Ticket Updates"       (Maintenance ticket status changes)
 *   - security:      "Security Alerts"      (Login & password change alerts)
 *   - announcements: "Announcements"        (General campus announcements)
 *   - resources:     "Resource Updates"      (New rooms, labs & equipment alerts)
 *
 * All default to TRUE (opt-in by default). When a user toggles one OFF,
 * NotificationService.sendNotification() checks these values and blocks delivery.
 * This object is embedded inside the User document in MongoDB (not a separate collection).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {
    @Builder.Default
    private boolean bookings = true;       // Category: Booking Updates
    @Builder.Default
    private boolean tickets = true;        // Category: Ticket Updates
    @Builder.Default
    private boolean security = true;       // Category: Security Alerts
    @Builder.Default
    private boolean announcements = true;  // Category: Announcements
    @Builder.Default
    private boolean resources = true;      // Category: Resource Updates
}
