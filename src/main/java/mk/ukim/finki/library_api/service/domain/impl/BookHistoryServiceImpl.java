package mk.ukim.finki.library_api.service.domain.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.BookHistory;
import mk.ukim.finki.library_api.repository.BookHistoryRepository;
import mk.ukim.finki.library_api.service.domain.BookHistoryService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookHistoryServiceImpl implements BookHistoryService {
    private final BookHistoryRepository bookHistoryRepository;

    @Override
    public BookHistory getHistory(String id) {
        return bookHistoryRepository.findById(id).orElse(new BookHistory(id));
    }

    @Override
    public void addHistoryEntry(String id, String description) {
        BookHistory history = getHistory(id);
        history.addDescription(description);
        bookHistoryRepository.save(history);
    }
}
