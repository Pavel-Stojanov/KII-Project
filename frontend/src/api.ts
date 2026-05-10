import axios, {type AxiosError} from 'axios';

const api = axios.create({
    baseURL: '/api'
});

const TOKEN_KEY = 'jwt_token';
let unauthorizedHandler: (() => void) | null = null;

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
    unauthorizedHandler = handler;
};

api.interceptors.request.use(
    config => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            clearStoredToken();
            unauthorizedHandler?.();
        }

        return Promise.reject(error);
    }
);


export default api;
