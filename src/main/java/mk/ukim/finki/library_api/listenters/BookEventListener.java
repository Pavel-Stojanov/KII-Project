package mk.ukim.finki.library_api.listenters;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mk.ukim.finki.library_api.events.BookRentedEvent;
import mk.ukim.finki.library_api.model.domain.ActivityLog;
import mk.ukim.finki.library_api.repository.ActivityLogRepository;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class BookEventListener {
    private final ActivityLogRepository activityLogRepository;

    @EventListener
    public void onBookRented(BookRentedEvent event) {
        log.info("Event: Book {} was rented", event.bookName());

        ActivityLog logEntry = new ActivityLog(event.bookName(), LocalDateTime.now(), "RENTED");
        activityLogRepository.save(logEntry);

        if (event.remainingCopies() == 0) {
            log.warn("WARNING: Book {} is no longer available (0 copies)", event.bookName());
            ActivityLog unavailableLog = new ActivityLog(event.bookName(), LocalDateTime.now(), "UNAVAILABLE");
            activityLogRepository.save(unavailableLog);
        }
    }
}
