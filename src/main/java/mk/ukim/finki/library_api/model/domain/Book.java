package mk.ukim.finki.library_api.model.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "books")
@Getter
@Setter
@NoArgsConstructor
public class Book extends BaseAuditableEntity {
    private String name;
    private Category category;

    @DocumentReference(lazy = true)
    private Author author;

    private State state;
    private Integer availableCopies;

    public Book(String name, Category category, Author author, State state, Integer availableCopies) {
        this.name = name;
        this.category = category;
        this.author = author;
        this.state = state;
        this.availableCopies = availableCopies;
    }
}
