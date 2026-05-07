package mk.ukim.finki.library_api.service.domain;

import mk.ukim.finki.library_api.model.domain.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityLogService {
    Page<ActivityLog> findAll(Pageable pageable);
}
