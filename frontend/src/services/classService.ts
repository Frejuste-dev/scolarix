import { api } from './api';

export interface Filiere {
    id: number;
    name: string;
    description: string;
}

export interface ClassEntity {
    id: number;
    name: string;
    level: string;
    filiere_id: number;
    academic_year_id: number;
    filiere?: Filiere;
}

export const classService = {
    async getFilieres(): Promise<Filiere[]> {
        const response = await api.get('/academic/filieres');
        return response.data;
    },

    async createFiliere(data: Omit<Filiere, 'id'>): Promise<Filiere> {
        const response = await api.post('/academic/filieres', data);
        return response.data;
    },

    async getClasses(yearId?: number): Promise<ClassEntity[]> {
        const response = await api.get('/classes', { params: { year_id: yearId } });
        return response.data;
    },

    async createClass(data: Omit<ClassEntity, 'id'>): Promise<ClassEntity> {
        const response = await api.post('/academic/classes', data);
        return response.data;
    },

    async deleteClass(id: number): Promise<void> {
        await api.delete(`/classes/${id}`);
    }
};
