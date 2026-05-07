package mk.ukim.finki.library_api.repository;

import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookFilterRepository {
    Page<Book> filter(Category category, State state, String authorId, Boolean hasAvailable, Pageable pageable);
}
