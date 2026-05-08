package mk.ukim.finki.library_api.web.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.dto.CreateAuthorDto;
import mk.ukim.finki.library_api.model.dto.DisplayAuthorDto;
import mk.ukim.finki.library_api.service.application.AuthorApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorApplicationService authorApplicationService;

    @GetMapping
    public Page<DisplayAuthorDto> getAllAuthors(Pageable pageable) {
        return authorApplicationService.getAllAuthors(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayAuthorDto> getAuthorById(@PathVariable String id) {
        return ResponseEntity.ok(authorApplicationService.getAuthorById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayAuthorDto> createAuthor(@RequestBody CreateAuthorDto authorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authorApplicationService.createAuthor(authorDto));
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<DisplayAuthorDto> updateAuthor(@PathVariable String id,
                                                         @RequestBody CreateAuthorDto authorDto) {
        return ResponseEntity.ok(authorApplicationService.updateAuthor(id, authorDto));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteAuthor(@PathVariable String id) {
        authorApplicationService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }
}
