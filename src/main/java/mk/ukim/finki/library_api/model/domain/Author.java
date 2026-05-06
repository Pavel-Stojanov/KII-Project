package mk.ukim.finki.library_api.model.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "authors")
@Getter
@Setter
@NoArgsConstructor
public class Author extends BaseAuditableEntity {
    private String name;
    private String surname;

    @DocumentReference(lazy = true)
    private Country country;

    public Author(String name, String surname, Country country) {
        this.name = name;
        this.surname = surname;
        this.country = country;
    }
}
