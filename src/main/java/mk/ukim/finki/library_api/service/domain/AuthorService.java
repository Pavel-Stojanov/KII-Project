package mk.ukim.finki.library_api.service.domain;

import mk.ukim.finki.library_api.model.domain.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuthorService {
    Page<Author> findAll(Pageable pageable);

    Author findById(String id);

    Author save(Author author);

    void delete(String id);
}
