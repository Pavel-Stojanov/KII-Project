import api from '../api';
import type {CategoryStatistics} from '../types';

export const statisticsRepository = {
    async getCategoryStatistics() {
        const response = await api.get<CategoryStatistics[]>('/books/views/materialized-statistics');
        return response.data;
    },
};
