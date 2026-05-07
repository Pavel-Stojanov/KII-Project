package mk.ukim.finki.library_api.repository;

import mk.ukim.finki.library_api.model.domain.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends MongoRepository<Author, String> {
    Page<Author> findAllByDeletedFalse(Pageable pageable);
}
