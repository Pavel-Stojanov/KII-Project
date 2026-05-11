import {useCallback, useEffect, useState} from 'react';
import type {Country, CountryRequest} from '../types';
import { countriesRepository } from '../repositories/countriesRepository';

export const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setCountries(await countriesRepository.getAll());
        } catch {
            setError('Грешка при вчитување на земјите.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void refetch();
        });
    }, [refetch]);

    const createCountry = useCallback(async (country: CountryRequest) => {
        await countriesRepository.create(country);
        await refetch();
    }, [refetch]);

    const updateCountry = useCallback(async (id: string, country: CountryRequest) => {
        await countriesRepository.update(id, country);
        await refetch();
    }, [refetch]);

    const deleteCountry = useCallback(async (id: string) => {
        await countriesRepository.delete(id);
        await refetch();
    }, [refetch]);

    return { countries, loading, error, refetch, createCountry, updateCountry, deleteCountry };
};

export const useCountry = (id: string | undefined) => {
    const [country, setCountry] = useState<Country | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCountry = async () => {
            if (!id) {
                setError('Country id is missing.');
                setLoading(false);
                return;
            }

            try {
                setCountry(await countriesRepository.getById(id));
            } catch {
                setError('Грешка при вчитување на деталите за земјата.');
            } finally {
                setLoading(false);
            }
        };

        loadCountry();
    }, [id]);

    return { country, loading, error };
};
