package mk.ukim.finki.library_api.service.application;

import mk.ukim.finki.library_api.model.dto.*;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookApplicationService {
    Page<DisplayBookDto> getAllBooks(Category category, State state, String authorId, Boolean hasAvailable, Pageable pageable);

    DisplayBookDto getBookById(String id);

    DisplayBookDto createBook(CreateBookDto bookDto);

    DisplayBookDto updateBook(String id, CreateBookDto bookDto);

    void deleteBook(String id);

    DisplayBookDto markAsRented(String id);

    Page<BookShortDto> getShortProjections(Pageable pageable);

    Page<BookExpandedDto> getExpandedProjections(Pageable pageable);

    Page<BookViewDto> getDatabaseView(Pageable pageable);

    List<CategoryStatisticsDto> getMaterializedViewStatistics();
}
