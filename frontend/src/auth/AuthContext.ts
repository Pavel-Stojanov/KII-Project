import {createContext} from 'react';
import type {AuthUser, LoginRequest, RegisterRequest, Role} from '../types';

export interface AuthContextValue {
    token: string | null;
    user: AuthUser | null;
    role: Role | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
