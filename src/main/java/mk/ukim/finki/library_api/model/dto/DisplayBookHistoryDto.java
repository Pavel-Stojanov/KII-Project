package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.BookHistory;

import java.util.List;

public record DisplayBookHistoryDto(
        String id,
        List<String> discriptions
) {
    public static DisplayBookHistoryDto from(BookHistory bookHistory) {
        return new DisplayBookHistoryDto(
                bookHistory.getId(),
                bookHistory.getDescriptions()
        );
    }
}
