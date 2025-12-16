import { api } from './api';
import { type User } from './authService';

export interface UserData extends Omit<User, 'id'> {
    id?: number;
    password?: string;
}

export const userService = {
    async getUsers(role?: string): Promise<User[]> {
        const response = await api.get('/users', { params: { role } });
        return response.data;
    },

    async createUser(data: UserData): Promise<User> {
        const response = await api.post('/users', data);
        return response.data;
    },

    async updateUser(id: number, data: Partial<UserData>): Promise<User> {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    }
};
