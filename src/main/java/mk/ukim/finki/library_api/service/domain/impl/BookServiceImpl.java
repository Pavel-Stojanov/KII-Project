package mk.ukim.finki.library_api.service.domain.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import mk.ukim.finki.library_api.model.exception.BookNotFoundException;
import mk.ukim.finki.library_api.repository.BookRepository;
import mk.ukim.finki.library_api.service.domain.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    @Override
    public Page<Book> findAll(Pageable pageable) {
        return bookRepository.findAllByDeletedFalse(pageable);
    }

    @Override
    public Book findById(String id) {
        return bookRepository.findById(id)
                .filter(b -> !b.isDeleted())
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void delete(Book book) {
        book.setDeleted(true);
        bookRepository.save(book);
    }

    @Override
    public Page<Book> filter(Category category, State state, String authorId, Boolean hasAvailable, Pageable pageable) {
        return bookRepository.filter(category, state, authorId, hasAvailable, pageable);
    }
}
