package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;

public record BookExpandedDto(
        String id,
        String name,
        Category category,
        State state,
        Integer availableCopies,
        String authorFullName,
        String authorCountryName
) {
    public static BookExpandedDto from(Book book) {
        String authorFullName = book.getAuthor().getName() + " " + book.getAuthor().getSurname();
        String countryName = book.getAuthor().getCountry().getName();
        return new BookExpandedDto(
                book.getId(),
                book.getName(),
                book.getCategory(),
                book.getState(),
                book.getAvailableCopies(),
                authorFullName,
                countryName
        );
    }
}
