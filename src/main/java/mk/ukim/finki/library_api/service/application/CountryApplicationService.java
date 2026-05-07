package mk.ukim.finki.library_api.service.application;

import mk.ukim.finki.library_api.model.dto.CreateCountryDto;
import mk.ukim.finki.library_api.model.dto.DisplayCountryDto;

import java.util.List;

public interface CountryApplicationService {
    List<DisplayCountryDto> getAllCountries();

    DisplayCountryDto getCountryById(String id);

    DisplayCountryDto createCountry(CreateCountryDto countryDto);

    DisplayCountryDto updateCountry(String id, CreateCountryDto countryDto);

    void deleteCountry(String id);
}
