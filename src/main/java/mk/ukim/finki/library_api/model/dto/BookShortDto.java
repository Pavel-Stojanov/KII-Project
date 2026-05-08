package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;

public record BookShortDto(
        String id,
        String name,
        Category category,
        State state,
        Integer availableCopies
) {
    public static BookShortDto from(Book book) {
        return new BookShortDto(
                book.getId(),
                book.getName(),
                book.getCategory(),
                book.getState(),
                book.getAvailableCopies()
        );
    }
}
