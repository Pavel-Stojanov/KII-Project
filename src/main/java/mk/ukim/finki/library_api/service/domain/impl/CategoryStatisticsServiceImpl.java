package mk.ukim.finki.library_api.service.domain.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.dto.CategoryStatisticsDto;
import mk.ukim.finki.library_api.service.domain.CategoryStatisticsService;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
@RequiredArgsConstructor
public class CategoryStatisticsServiceImpl implements CategoryStatisticsService {
    private final MongoTemplate mongoTemplate;

    @Override
    public List<CategoryStatisticsDto> computeStatistics() {
        Aggregation aggregation = newAggregation(
                match(Criteria.where("deleted").is(false)),
                group("category")
                        .count().as("totalBooks")
                        .sum("availableCopies").as("totalAvailableCopies")
                        .sum(ConditionalOperators.when(Criteria.where("state").is("BAD")).then(1).otherwise(0)).as("booksInBadState"),
                project()
                        .and("_id").as("category")
                        .andInclude("totalBooks", "totalAvailableCopies", "booksInBadState")
        );

        return mongoTemplate.aggregate(aggregation, "books", CategoryStatisticsDto.class).getMappedResults();
    }
}
