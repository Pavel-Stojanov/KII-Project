package mk.ukim.finki.library_api.web.handler;

import mk.ukim.finki.library_api.model.exception.AuthorNotFoundException;
import mk.ukim.finki.library_api.model.exception.BookNotFoundException;
import mk.ukim.finki.library_api.model.exception.CountryNotFoundException;
import mk.ukim.finki.library_api.model.exception.NoAvailableCopiesException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler({
            AuthorNotFoundException.class,
            BookNotFoundException.class,
            CountryNotFoundException.class,
            NoAvailableCopiesException.class
    })
    public ResponseEntity<String> handleCustomExceptions(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<String> handleDuplicateKeyException() {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Entity cannot be created because a record with that unique key already exists.");
    }
}
