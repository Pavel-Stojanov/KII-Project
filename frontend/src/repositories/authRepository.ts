import api from '../api';
import type {AuthResponse, LoginRequest, RegisterRequest} from '../types';

export const authRepository = {
    async login(credentials: LoginRequest) {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    async register(request: RegisterRequest) {
        const response = await api.post<AuthResponse>('/auth/register', request);
        return response.data;
    },
};
