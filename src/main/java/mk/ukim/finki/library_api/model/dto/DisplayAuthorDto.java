package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.Author;

import java.util.List;

public record DisplayAuthorDto(
        String id,
        String name,
        String surname,
        String countryId
) {
    public static DisplayAuthorDto from(Author author) {
        return new DisplayAuthorDto(
                author.getId(),
                author.getName(),
                author.getSurname(),
                author.getCountry().getId()
        );
    }

    public static List<DisplayAuthorDto> from(List<Author> authors) {
        return authors.stream()
                .map(DisplayAuthorDto::from)
                .toList();
    }
}
