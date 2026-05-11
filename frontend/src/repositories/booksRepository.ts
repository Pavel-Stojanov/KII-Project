import api from '../api';
import type {Book, BookRequest, PageResponse} from '../types';

export const booksRepository = {
    async getAll() {
        const response = await api.get<PageResponse<Book>>('/books', {params: {size: 1000}});
        return response.data.content;
    },

    async getById(id: string) {
        const response = await api.get<Book>(`/books/${id}`);
        return response.data;
    },

    async create(book: BookRequest) {
        const response = await api.post<Book>('/books/add', book);
        return response.data;
    },

    async update(id: string, book: BookRequest) {
        const response = await api.put<Book>(`/books/${id}/edit`, book);
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/books/${id}/delete`);
    },
};
