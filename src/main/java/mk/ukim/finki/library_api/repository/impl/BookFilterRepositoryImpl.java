package mk.ukim.finki.library_api.repository.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.Book;
import mk.ukim.finki.library_api.model.enums.Category;
import mk.ukim.finki.library_api.model.enums.State;
import mk.ukim.finki.library_api.repository.BookFilterRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class BookFilterRepositoryImpl implements BookFilterRepository {
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Book> filter(Category category, State state, String authorId, Boolean hasAvailable, Pageable pageable) {
        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("deleted").is(false));

        if (category != null) {
            criteriaList.add(Criteria.where("category").is(category.name()));
        }
        if (state != null) {
            criteriaList.add(Criteria.where("state").is(state.name()));
        }
        if (authorId != null) {
            criteriaList.add(Criteria.where("author").is(new ObjectId(authorId)));
        }
        if (hasAvailable != null) {
            if (hasAvailable) {
                criteriaList.add(Criteria.where("availableCopies").gt(0));
            } else {
                criteriaList.add(Criteria.where("availableCopies").is(0));
            }
        }

        Criteria combined = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        Query query = new Query(combined).with(pageable);
        Query countQuery = new Query(combined);

        List<Book> books = mongoTemplate.find(query, Book.class);
        return PageableExecutionUtils.getPage(books, pageable,
                () -> mongoTemplate.count(countQuery, Book.class));
    }
}
