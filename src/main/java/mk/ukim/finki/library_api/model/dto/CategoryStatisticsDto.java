package mk.ukim.finki.library_api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatisticsDto {
    private String category;
    private Long totalBooks;
    private Long totalAvailableCopies;
    private Long booksInBadState;
}
