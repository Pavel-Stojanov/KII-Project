import {isAxiosError} from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError(error)) {
        const responseData = error.response?.data;

        if (typeof responseData === 'string' && responseData.trim().length > 0) {
            return responseData;
        }

        if (responseData && typeof responseData === 'object') {
            const messages = Object.values(responseData)
                .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

            if (messages.length > 0) {
                return messages.join(' ');
            }
        }
    }

    return fallback;
};
