package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.Author;
import mk.ukim.finki.library_api.model.domain.Country;

public record CreateAuthorDto(
        String name,
        String surname,
        String countryId
) {
    public Author toAuthor(Country country) {
        return new Author(name, surname, country);
    }
}
