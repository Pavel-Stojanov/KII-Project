import {useCallback, useEffect, useState} from "react";
import type {Book, BookRequest} from "../types";
import {booksRepository} from "../repositories/booksRepository";

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setBooks(await booksRepository.getAll());
        } catch {
            setError('Error when loading books');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void refetch();
        });
    }, [refetch]);

    const createBook = useCallback(async (book: BookRequest) => {
        await booksRepository.create(book);
        await refetch();
    }, [refetch]);

    const updateBook = useCallback(async (id: string, book: BookRequest) => {
        await booksRepository.update(id, book);
        await refetch();
    }, [refetch]);

    const deleteBook = useCallback(async (id: string) => {
        await booksRepository.delete(id);
        await refetch();
    }, [refetch]);

    return {books, loading, error, refetch, createBook, updateBook, deleteBook};
};

export const useBook = (id: string | undefined) => {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBook = async () => {
            if (!id) {
                setError('Book id is missing.');
                setLoading(false);
                return;
            }

            try {
                setBook(await booksRepository.getById(id));
            } catch {
                setError('Error when loading book details')
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [id]);

    return {book, loading, error};
};
