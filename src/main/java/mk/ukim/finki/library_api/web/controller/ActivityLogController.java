package mk.ukim.finki.library_api.web.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.dto.DisplayActivityLogDto;
import mk.ukim.finki.library_api.service.application.ActivityLogApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogApplicationService activityLogApplicationService;

    @GetMapping
    public Page<DisplayActivityLogDto> getLogs(Pageable pageable) {
        return activityLogApplicationService.getAllLogs(pageable);

    }
}
