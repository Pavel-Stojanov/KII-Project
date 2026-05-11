import api from '../api';
import type {Country, CountryRequest} from '../types';

export const countriesRepository = {
    async getAll() {
        const response = await api.get<Country[]>('/countries');
        return response.data;
    },

    async getById(id: string) {
        const response = await api.get<Country>(`/countries/${id}`);
        return response.data;
    },

    async create(country: CountryRequest) {
        const response = await api.post<Country>('/countries/add', country);
        return response.data;
    },

    async update(id: string, country: CountryRequest) {
        const response = await api.put<Country>(`/countries/${id}/edit`, country);
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/countries/${id}/delete`);
    },
};
