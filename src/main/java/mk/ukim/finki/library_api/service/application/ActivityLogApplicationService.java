package mk.ukim.finki.library_api.service.application;

import mk.ukim.finki.library_api.model.dto.DisplayActivityLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityLogApplicationService {
    Page<DisplayActivityLogDto> getAllLogs(Pageable pageable);
}
