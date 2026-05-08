package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.ActivityLog;

import java.time.LocalDateTime;

public record DisplayActivityLogDto(
        String id,
        String bookName,
        LocalDateTime eventTime,
        String eventType
) {
    public static DisplayActivityLogDto from(ActivityLog activityLog) {
        return new DisplayActivityLogDto(
                activityLog.getId(),
                activityLog.getBookName(),
                activityLog.getEventTime(),
                activityLog.getEventType()
        );
    }
}
