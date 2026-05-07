package mk.ukim.finki.library_api.repository;

import mk.ukim.finki.library_api.model.domain.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends MongoRepository<Book, String>, BookFilterRepository {
    Page<Book> findAllByDeletedFalse(Pageable pageable);
}
