package mk.ukim.finki.library_api.repository;

import mk.ukim.finki.library_api.model.domain.Country;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends MongoRepository<Country, String> {
    List<Country> findAllByDeletedFalse();
}
