import api from '../api';
import type {Author, AuthorRequest, PageResponse} from '../types';

export const authorsRepository = {
    async getAll() {
        const response = await api.get<PageResponse<Author>>('/authors', {params: {size: 1000}});
        return response.data.content;
    },

    async getById(id: string) {
        const response = await api.get<Author>(`/authors/${id}`);
        return response.data;
    },

    async create(author: AuthorRequest) {
        const response = await api.post<Author>('/authors/add', author);
        return response.data;
    },

    async update(id: string, author: AuthorRequest) {
        const response = await api.put<Author>(`/authors/${id}/edit`, author);
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/authors/${id}/delete`);
    },
};
