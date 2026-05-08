package mk.ukim.finki.library_api.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.dto.CreateCountryDto;
import mk.ukim.finki.library_api.model.dto.DisplayCountryDto;
import mk.ukim.finki.library_api.service.application.CountryApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {
    private final CountryApplicationService countryApplicationService;

    @GetMapping
    public List<DisplayCountryDto> getAllCountries() {
        return countryApplicationService.getAllCountries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCountryDto> getCountryById(@PathVariable String id) {
        return ResponseEntity.ok(countryApplicationService.getCountryById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayCountryDto> createCountry(@Valid @RequestBody CreateCountryDto countryDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(countryApplicationService.createCountry(countryDto));
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<DisplayCountryDto> updateCountry(@PathVariable String id,
                                                           @Valid @RequestBody CreateCountryDto countryDto) {
        return ResponseEntity.ok(countryApplicationService.updateCountry(id, countryDto));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteCountry(@PathVariable String id) {
        countryApplicationService.deleteCountry(id);
        return ResponseEntity.noContent().build();
    }
}
