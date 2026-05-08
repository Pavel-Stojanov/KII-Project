package mk.ukim.finki.library_api.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mk.ukim.finki.library_api.model.domain.Author;
import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;

public record CreateBookDto(
        @NotBlank(message = "Името на книгата е задолжително")
        String name,
        @NotNull(message = "Категоријата е задолжителна")
        Category category,
        @NotNull(message = "Авторот е задолжителен")
        String authorId,
        @NotNull(message = "Состојбата е задолжителна")
        State state,
        @NotNull(message = "Бројот на копии е задолжителен")
        @Min(value = 0, message = "Бројот на достапни копии не може да биде негативен")
        Integer availableCopies
) {
    public Book toBook(Author author) {
        return new Book(name, category, author, state, availableCopies);
    }
}
