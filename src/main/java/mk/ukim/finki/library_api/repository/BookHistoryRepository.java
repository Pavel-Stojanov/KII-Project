package mk.ukim.finki.library_api.repository;

import mk.ukim.finki.library_api.model.domain.BookHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookHistoryRepository extends MongoRepository<BookHistory, String> {
}
