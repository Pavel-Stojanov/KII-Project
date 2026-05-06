package mk.ukim.finki.library_api.model.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
public class ActivityLog {
    @Id
    private String id;
    private String bookName;
    private LocalDateTime eventTime;
    private String eventType;

    public ActivityLog(String bookName, LocalDateTime eventTime, String eventType) {
        this.bookName = bookName;
        this.eventTime = eventTime;
        this.eventType = eventType;
    }
}
