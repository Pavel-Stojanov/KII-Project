import {useEffect, useState} from "react";
import type {CategoryStatistics} from "../types";
import {statisticsRepository} from "../repositories/statisticsRepository";

export const useCategoryStatistics = () => {
    const [statistics, setStatistics] = useState<CategoryStatistics[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setStatistics(await statisticsRepository.getCategoryStatistics());
            } catch {
                setError('Failed to load Statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);
    return {statistics, loading, error};
}
