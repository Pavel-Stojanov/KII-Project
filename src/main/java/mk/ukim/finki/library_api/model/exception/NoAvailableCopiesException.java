package mk.ukim.finki.library_api.model.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NoAvailableCopiesException extends RuntimeException {
    public NoAvailableCopiesException(String id) {
        super("Нема достапни копии од книгата со ID " + id);
    }
}
