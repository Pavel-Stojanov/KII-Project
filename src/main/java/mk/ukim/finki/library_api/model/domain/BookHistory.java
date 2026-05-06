package mk.ukim.finki.library_api.model.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "book_histories")
@Getter
@Setter
@NoArgsConstructor
public class BookHistory {
    @Id
    private String id;

    private List<String> descriptions = new ArrayList<>();

    public BookHistory(String id) {
        this.id = id;
    }

    public void addDescription(String description) {
        descriptions.add(description);
    }
}
