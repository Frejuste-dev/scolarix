import { api } from './api';
import { type User } from './authService';

export interface UserData extends Omit<User, 'id'> {
    id?: number;
    password?: string; // Optional for updates
}

// MOCK DATA
let MOCK_USERS_DB: User[] = [
    { id: 1, first_name: 'Super', last_name: 'Admin', email: 'admin@scolarix.com', role: 'ADMIN' },
    { id: 2, first_name: 'Jean', last_name: 'Prof', email: 'teacher@scolarix.com', role: 'TEACHER' },
    { id: 3, first_name: 'Alice', last_name: 'Eleve', email: 'student@scolarix.com', role: 'STUDENT' },
    { id: 4, first_name: 'Bob', last_name: 'Eleve', email: 'bob@scolarix.com', role: 'STUDENT' },
    { id: 5, first_name: 'Marie', last_name: 'Curie', email: 'marie@science.com', role: 'TEACHER' },
];

export const userService = {
    async getUsers(role?: string): Promise<User[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 500));
            if (role) return MOCK_USERS_DB.filter(u => u.role === role);
            return [...MOCK_USERS_DB];
        }
        const response = await api.get('/users', { params: { role } });
        return response.data;
    },

    async createUser(data: UserData): Promise<User> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 500));
            const newUser = { ...data, id: Date.now() } as User; // Mock ID
            MOCK_USERS_DB.push(newUser);
            return newUser;
        }
        const response = await api.post('/users', data);
        return response.data;
    },

    async updateUser(id: number, data: Partial<UserData>): Promise<User> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 500));
            MOCK_USERS_DB = MOCK_USERS_DB.map(u => (u.id === id ? { ...u, ...data } as User : u));
            return MOCK_USERS_DB.find(u => u.id === id)!;
        }
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: number): Promise<void> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 500));
            MOCK_USERS_DB = MOCK_USERS_DB.filter(u => u.id !== id);
            return;
        }
        await api.delete(`/users/${id}`);
    }
};
