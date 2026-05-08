package mk.ukim.finki.library_api.model.dto;

import mk.ukim.finki.library_api.model.domain.Country;

import java.util.List;

public record DisplayCountryDto(
        String id,
        String name,
        String continent
) {
    public static DisplayCountryDto from(Country country) {
        return new DisplayCountryDto(
                country.getId(),
                country.getName(),
                country.getContinent()
        );
    }

    public static List<DisplayCountryDto> from(List<Country> countries) {
        return countries.stream()
                .map(DisplayCountryDto::from)
                .toList();
    }
}
