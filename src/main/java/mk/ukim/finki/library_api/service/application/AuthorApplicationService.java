package mk.ukim.finki.library_api.service.application;

import mk.ukim.finki.library_api.model.dto.CreateAuthorDto;
import mk.ukim.finki.library_api.model.dto.DisplayAuthorDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuthorApplicationService {
    Page<DisplayAuthorDto> getAllAuthors(Pageable pageable);

    DisplayAuthorDto getAuthorById(String id);

    DisplayAuthorDto createAuthor(CreateAuthorDto authorDto);

    DisplayAuthorDto updateAuthor(String id, CreateAuthorDto authorDto);

    void deleteAuthor(String id);
}
