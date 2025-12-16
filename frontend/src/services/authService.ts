import { api } from './api';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
    birthdate?: string;
    phone?: string;
    address?: string;
    gender?: 'M' | 'F' | 'OTHER';
    photo_url?: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        // REAL implementation - OAuth2 expects form data, not JSON
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post<LoginResponse>('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
};
