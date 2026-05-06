package mk.ukim.finki.library_api.model.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "countries")
@Getter
@Setter
@NoArgsConstructor
public class Country extends BaseEntity {
    private String name;
    private String continent;
}
