package mk.ukim.finki.library_api.service.domain.impl;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.library_api.model.domain.Country;
import mk.ukim.finki.library_api.model.exception.CountryNotFoundException;
import mk.ukim.finki.library_api.repository.CountryRepository;
import mk.ukim.finki.library_api.service.domain.CountryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements CountryService {
    private final CountryRepository countryRepository;

    @Override
    public List<Country> findAll() {
        return countryRepository.findAllByDeletedFalse();
    }

    @Override
    public Country findById(String id) {
        return countryRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new CountryNotFoundException(id));
    }

    @Override
    public Country save(Country country) {
        return countryRepository.save(country);
    }

    @Override
    public void delete(String id) {
        Country country = findById(id);
        country.setDeleted(true);
        countryRepository.save(country);
    }
}
