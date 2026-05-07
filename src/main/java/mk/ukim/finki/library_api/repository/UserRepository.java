package mk.ukim.finki.library_api.repository;

import mk.ukim.finki.library_api.model.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
