package mk.ukim.finki.library_api.service.domain;

import mk.ukim.finki.library_api.model.dto.CategoryStatisticsDto;

import java.util.List;

public interface CategoryStatisticsService {
    List<CategoryStatisticsDto> computeStatistics();
}
