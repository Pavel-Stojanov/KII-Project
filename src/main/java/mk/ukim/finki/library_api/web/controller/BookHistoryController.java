package mk.ukim.finki.library_api.web.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.dto.DisplayBookHistoryDto;
import mk.ukim.finki.library_api.service.domain.BookHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/book-history")
@RequiredArgsConstructor
public class BookHistoryController {
    private final BookHistoryService bookHistoryService;

    @GetMapping("/{id}")
    public ResponseEntity<DisplayBookHistoryDto> getBookHistory(@PathVariable String id) {
        return ResponseEntity.ok(DisplayBookHistoryDto.from(bookHistoryService.getHistory(id)));
    }
}
