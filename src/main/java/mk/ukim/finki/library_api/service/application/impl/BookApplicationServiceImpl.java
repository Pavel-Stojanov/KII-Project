package mk.ukim.finki.library_api.service.application.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.events.BookRentedEvent;
import mk.ukim.finki.library_api.model.domain.Author;
import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.dto.*;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import mk.ukim.finki.library_api.model.exception.NoAvailableCopiesException;
import mk.ukim.finki.library_api.service.application.BookApplicationService;
import mk.ukim.finki.library_api.service.domain.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookApplicationServiceImpl implements BookApplicationService {
    private final BookService bookService;
    private final AuthorService authorService;
    private final ApplicationEventPublisher eventPublisher;
    private final CategoryStatisticsService categoryStatisticsService;
    private final BookHistoryService bookHistoryService;

    @Override
    public Page<DisplayBookDto> getAllBooks(Category category, State state, String authorId, Boolean hasAvailable, Pageable pageable) {
        return bookService.filter(category, state, authorId, hasAvailable, pageable).map(DisplayBookDto::from);
    }

    @Override
    public DisplayBookDto getBookById(String id) {
        return DisplayBookDto.from(bookService.findById(id));
    }

    @Override
    @Transactional
    public DisplayBookDto createBook(CreateBookDto bookDto) {
        Author author = authorService.findById(bookDto.authorId());
        Book bookToSave = bookDto.toBook(author);
        Book savedBook = bookService.save(bookToSave);
        bookHistoryService.addHistoryEntry(savedBook.getId(), "Added book with id " + savedBook.getId() + " in " + LocalDateTime.now());
        return DisplayBookDto.from(savedBook);
    }

    @Override
    @Transactional
    public DisplayBookDto updateBook(String id, CreateBookDto bookDto) {
        Book book = bookService.findById(id);
        Author author = authorService.findById(bookDto.authorId());

        book.setName(bookDto.name());
        book.setCategory(bookDto.category());
        book.setAuthor(author);
        book.setState(bookDto.state());
        book.setAvailableCopies(bookDto.availableCopies());

        Book updatedBook = bookService.save(book);
        bookHistoryService.addHistoryEntry(updatedBook.getId(), "Updated book with id " + updatedBook.getId() + " in " + LocalDateTime.now());
        return DisplayBookDto.from(updatedBook);
    }

    @Override
    @Transactional
    public void deleteBook(String id) {
        Book book = bookService.findById(id);
        bookHistoryService.addHistoryEntry(book.getId(), "Deleted book with id " + book.getId() + " in " + LocalDateTime.now());
        bookService.delete(book);
    }

    @Override
    @Transactional
    public DisplayBookDto markAsRented(String id) {
        Book book = bookService.findById(id);

        if (book.getAvailableCopies() <= 0) {
            throw new NoAvailableCopiesException(id);
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        Book updatedBook = bookService.save(book);

        eventPublisher.publishEvent(new BookRentedEvent(book.getId(), book.getName(), book.getAvailableCopies()));
        bookHistoryService.addHistoryEntry(updatedBook.getId(), "Rented book with id " + updatedBook.getId() + " in " + LocalDateTime.now());

        return DisplayBookDto.from(updatedBook);
    }

    @Override
    public Page<BookShortDto> getShortProjections(Pageable pageable) {
        return bookService.findAll(pageable).map(BookShortDto::from);
    }

    @Override
    public Page<BookExpandedDto> getExpandedProjections(Pageable pageable) {
        return bookService.findAll(pageable).map(BookExpandedDto::from);
    }

    @Override
    public Page<BookViewDto> getDatabaseView(Pageable pageable) {
        return bookService.findAll(pageable).map(BookViewDto::from);
    }

    @Override
    public List<CategoryStatisticsDto> getMaterializedViewStatistics() {
        return categoryStatisticsService.computeStatistics();
    }
}
