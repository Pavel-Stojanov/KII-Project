package mk.ukim.finki.library_api.events;

public record BookRentedEvent(
        String bookId,
        String bookName,
        Integer remainingCopies
) {
}
