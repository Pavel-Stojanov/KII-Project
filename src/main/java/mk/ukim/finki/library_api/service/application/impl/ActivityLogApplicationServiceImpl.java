package mk.ukim.finki.library_api.service.application.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.dto.DisplayActivityLogDto;
import mk.ukim.finki.library_api.service.application.ActivityLogApplicationService;
import mk.ukim.finki.library_api.service.domain.ActivityLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogApplicationServiceImpl implements ActivityLogApplicationService {
    private final ActivityLogService activityLogService;

    @Override
    public Page<DisplayActivityLogDto> getAllLogs(Pageable pageable) {
        return activityLogService.findAll(pageable).map(DisplayActivityLogDto::from);
    }
}
