import { api } from './api';

export interface AcademicPeriod {
    id: number;
    name: string; // "Trimestre 1", "Semestre 2"
    start_date: string;
    end_date: string;
    academic_year_id: number;
    is_active: boolean;
}

// MOCK DATA
let MOCK_PERIODS: AcademicPeriod[] = [
    { id: 1, name: 'Trimestre 1', start_date: '2024-09-01', end_date: '2024-12-31', academic_year_id: 2024, is_active: false },
    { id: 2, name: 'Trimestre 2', start_date: '2025-01-01', end_date: '2025-03-31', academic_year_id: 2024, is_active: true },
    { id: 3, name: 'Trimestre 3', start_date: '2025-04-01', end_date: '2025-06-30', academic_year_id: 2024, is_active: false },
];

export const periodService = {
    async getPeriods(yearId?: number): Promise<AcademicPeriod[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 400));
            if (yearId) return MOCK_PERIODS.filter(p => p.academic_year_id === yearId);
            return [...MOCK_PERIODS];
        }
        const response = await api.get('/periods', { params: { year_id: yearId } });
        return response.data;
    },

    async createPeriod(data: Omit<AcademicPeriod, 'id'>): Promise<AcademicPeriod> {
        if (import.meta.env.DEV) {
            const newPeriod = { ...data, id: Date.now() };
            MOCK_PERIODS.push(newPeriod);
            return newPeriod;
        }
        const response = await api.post('/periods', data);
        return response.data;
    },

    async updatePeriod(id: number, data: Partial<AcademicPeriod>): Promise<AcademicPeriod> {
        if (import.meta.env.DEV) {
            MOCK_PERIODS = MOCK_PERIODS.map(p => (p.id === id ? { ...p, ...data } : p));
            return MOCK_PERIODS.find(p => p.id === id)!;
        }
        const response = await api.put(`/periods/${id}`, data);
        return response.data;
    },

    async deletePeriod(id: number): Promise<void> {
        if (import.meta.env.DEV) {
            MOCK_PERIODS = MOCK_PERIODS.filter(p => p.id !== id);
            return;
        }
        await api.delete(`/periods/${id}`);
    }
};
