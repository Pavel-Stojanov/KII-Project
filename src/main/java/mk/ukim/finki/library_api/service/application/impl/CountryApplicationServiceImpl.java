package mk.ukim.finki.library_api.service.application.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.Country;
import mk.ukim.finki.library_api.model.dto.CreateCountryDto;
import mk.ukim.finki.library_api.model.dto.DisplayCountryDto;
import mk.ukim.finki.library_api.service.application.CountryApplicationService;
import mk.ukim.finki.library_api.service.domain.CountryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryApplicationServiceImpl implements CountryApplicationService {
    private final CountryService countryService;

    @Override
    public List<DisplayCountryDto> getAllCountries() {
        return DisplayCountryDto.from(countryService.findAll());
    }

    @Override
    public DisplayCountryDto getCountryById(String id) {
        return DisplayCountryDto.from(countryService.findById(id));
    }

    @Override
    @Transactional
    public DisplayCountryDto createCountry(CreateCountryDto countryDto) {
        Country savedCountry = countryService.save(countryDto.toCountry());
        return DisplayCountryDto.from(savedCountry);
    }

    @Override
    @Transactional
    public DisplayCountryDto updateCountry(String id, CreateCountryDto countryDto) {
        Country country = countryService.findById(id);

        country.setName(countryDto.name());
        country.setContinent(countryDto.continent());

        Country savedCountry = countryService.save(country);
        return DisplayCountryDto.from(savedCountry);
    }

    @Override
    @Transactional
    public void deleteCountry(String id) {
        countryService.delete(id);
    }
}
