package mk.ukim.finki.library_api.service.domain.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.Author;
import mk.ukim.finki.library_api.model.exception.AuthorNotFoundException;
import mk.ukim.finki.library_api.repository.AuthorRepository;
import mk.ukim.finki.library_api.service.domain.AuthorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {
    private final AuthorRepository authorRepository;

    @Override
    public Page<Author> findAll(Pageable pageable) {
        return authorRepository.findAllByDeletedFalse(pageable);
    }

    @Override
    public Author findById(String id) {
        return authorRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new AuthorNotFoundException(id));
    }

    @Override
    public Author save(Author author) {
        return authorRepository.save(author);
    }

    @Override
    public void delete(String id) {
        Author author = findById(id);
        author.setDeleted(true);
        authorRepository.save(author);
    }
}
