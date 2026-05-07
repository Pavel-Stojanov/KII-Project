package mk.ukim.finki.library_api.service.domain;

import mk.ukim.finki.library_api.model.domain.Country;

import java.util.List;

public interface CountryService {
    List<Country> findAll();

    Country findById(String id);

    Country save(Country country);

    void delete(String id);
}
