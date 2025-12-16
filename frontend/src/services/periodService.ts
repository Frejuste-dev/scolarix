import { api } from './api';

export interface AcademicPeriod {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    academic_year_id: number;
    is_active: boolean;
}

export const periodService = {
    async getPeriods(yearId?: number): Promise<AcademicPeriod[]> {
        const response = await api.get('/periods', { params: { year_id: yearId } });
        return response.data;
    },

    async createPeriod(data: Omit<AcademicPeriod, 'id'>): Promise<AcademicPeriod> {
        const response = await api.post('/academic/periods', data);
        return response.data;
    },

    async updatePeriod(id: number, data: Partial<AcademicPeriod>): Promise<AcademicPeriod> {
        const response = await api.put(`/periods/${id}`, data);
        return response.data;
    },

    async deletePeriod(id: number): Promise<void> {
        await api.delete(`/periods/${id}`);
    }
};
