package mk.ukim.finki.library_api.service.domain.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.ActivityLog;
import mk.ukim.finki.library_api.repository.ActivityLogRepository;
import mk.ukim.finki.library_api.service.domain.ActivityLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    @Override
    public Page<ActivityLog> findAll(Pageable pageable) {
        return activityLogRepository.findAll(pageable);
    }
}
