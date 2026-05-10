export interface Country {
    id: string;
    name: string;
    continent: string;
}

export interface CountryRequest {
    name: string;
    continent: string;
}

export interface Author {
    id: string;
    name: string;
    surname: string;
    countryId: string;
}

export interface AuthorRequest {
    name: string;
    surname: string;
    countryId: string;
}

export const BOOK_CATEGORIES = [
    'NOVEL',
    'THRILLER',
    'HISTORY',
    'FANTASY',
    'BIOGRAPHY',
    'CLASSICS',
    'DRAMA'
] as const;

export type BookCategory = typeof BOOK_CATEGORIES[number];

export const BOOK_STATES = ['GOOD', 'BAD'] as const;

export type BookState = typeof BOOK_STATES[number];

export interface Book {
    id: string;
    name: string;
    category: BookCategory;
    authorId: string;
    state: BookState;
    availableCopies: number;
}

export interface BookRequest {
    name: string;
    category: BookCategory;
    authorId: string;
    state: BookState;
    availableCopies: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface CategoryStatistics {
    category: string;
    totalBooks: number;
    totalAvailableCopies: number;
    booksInBadState: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    name: string;
    surname: string;
}

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface AuthUser {
    username: string;
    role: Role;
}

export interface AuthResponse {
    token: string;
    username: string;
    role: Role;
}
