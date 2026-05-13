package mk.ukim.finki.library_api.config;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.*;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.Role;
import mk.ukim.finki.library_api.model.enums.State;
import mk.ukim.finki.library_api.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {
    private final CountryRepository countryRepository;
    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
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
}
