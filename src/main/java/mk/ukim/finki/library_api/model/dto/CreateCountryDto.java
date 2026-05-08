package mk.ukim.finki.library_api.model.dto;

import jakarta.validation.constraints.NotBlank;
import mk.ukim.finki.library_api.model.domain.Country;

public record CreateCountryDto(
        @NotBlank(message = "Името на земјата е задолжително")
        String name,
        @NotBlank(message = "Континентот е задолжителен")
        String continent
) {
    public Country toCountry() {
        Country country = new Country();
        country.setName(name);
        country.setContinent(continent);
        return country;
    }
}
