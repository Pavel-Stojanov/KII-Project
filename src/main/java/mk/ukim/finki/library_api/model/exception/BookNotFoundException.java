package mk.ukim.finki.library_api.model.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(String id) {
        super("Книгата со ID " + id + " не е пронајдена.");
    }
}
