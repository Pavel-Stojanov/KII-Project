package mk.ukim.finki.library_api.config;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.*;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.Role;
import mk.ukim.finki.library_api.model.enums.State;
import mk.ukim.finki.library_api.repository.*;
import org.bson.Document;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {
    private static final String SEED_LOCK_COLLECTION = "seed_lock";
    private static final String SEED_LOCK_ID = "data-seeder";

    private final CountryRepository countryRepository;
    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    @Override
    public void run(ApplicationArguments args) {
        // With multiple backend replicas, guard seeding with a unique lock document
        // so exactly one instance seeds. The unique _id makes the insert atomic on
        // the replica-set primary; every other replica loses the race and returns.
        if (!acquireSeedLock()) return;
        if (countryRepository.count() > 0) return;

        Country uk = new Country();
        uk.setName("UK");
        uk.setContinent("Europe");
        countryRepository.save(uk);

        Country usa = new Country();
        usa.setName("USA");
        usa.setContinent("North America");
        countryRepository.save(usa);

        Author rowling = new Author("J.K.", "Rowling", uk);
        authorRepository.save(rowling);

        Author martin = new Author("George R.R.", "Martin", usa);
        authorRepository.save(martin);

        bookRepository.save(new Book("Harry Potter and the Philosopher's Stone", Category.FANTASY, rowling, State.GOOD, 5));
        bookRepository.save(new Book("A Game of Thrones", Category.FANTASY, martin, State.GOOD, 3));
        bookRepository.save(new Book("Old Damaged Novel", Category.NOVEL, rowling, State.BAD, 0));

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setName("Admin");
            admin.setSurname("User");
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
        }
    }

    private boolean acquireSeedLock() {
        try {
            mongoTemplate.insert(new Document("_id", SEED_LOCK_ID), SEED_LOCK_COLLECTION);
            return true;
        } catch (DuplicateKeyException e) {
            return false;
        }
    }
}
