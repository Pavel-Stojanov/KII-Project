import {useCallback, useEffect, useState} from 'react';
import type {Author, AuthorRequest} from '../types';
import { authorsRepository } from '../repositories/authorsRepository';

export const useAuthors = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setAuthors(await authorsRepository.getAll());
        } catch {
            setError('Грешка при вчитување на авторите.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void refetch();
        });
    }, [refetch]);

    const createAuthor = useCallback(async (author: AuthorRequest) => {
        await authorsRepository.create(author);
        await refetch();
    }, [refetch]);

    const updateAuthor = useCallback(async (id: string, author: AuthorRequest) => {
        await authorsRepository.update(id, author);
        await refetch();
    }, [refetch]);

    const deleteAuthor = useCallback(async (id: string) => {
        await authorsRepository.delete(id);
        await refetch();
    }, [refetch]);

    return { authors, loading, error, refetch, createAuthor, updateAuthor, deleteAuthor };
};

export const useAuthor = (id: string | undefined) => {
    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAuthor = async () => {
            if (!id) {
                setError('Author id is missing.');
                setLoading(false);
                return;
            }

            try {
                setAuthor(await authorsRepository.getById(id));
            } catch {
                setError('Грешка при вчитување на деталите за авторот.');
            } finally {
                setLoading(false);
            }
        };

        loadAuthor();
    }, [id]);

    return { author, loading, error };
};
