package mk.ukim.finki.library_api.service.domain;

import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {
    Page<Book> findAll(Pageable pageable);

    Book findById(String id);

    Book save(Book book);

    void delete(Book book);

    Page<Book> filter(Category category, State state, String authorId, Boolean hasAvailable, Pageable pageable);
}
