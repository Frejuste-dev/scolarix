import { api } from './api';

export interface Evaluation {
    id: number;
    subject_id: number;
    class_id: number;
    period_id: number;
    type: 'CONTROLE' | 'EXAMEN';
    date: string;
    max_score: number;
    title?: string;
}

export interface Grade {
    id: number;
    evaluation_id: number;
    student_id: number;
    score: number;
    evaluation?: Evaluation;
}

export const evaluationService = {
    async getEvaluations(classId: number, subjectId: number, periodId: number): Promise<Evaluation[]> {
        const response = await api.get('/evaluations', { params: { class_id: classId, subject_id: subjectId, period_id: periodId } });
        return response.data;
    },

    async createEvaluation(data: Omit<Evaluation, 'id'>): Promise<Evaluation> {
        const response = await api.post('/evaluations', data);
        return response.data;
    },

    async saveGrades(evaluationId: number, grades: { student_id: number, score: number }[]): Promise<void> {
        await api.post(`/evaluations/${evaluationId}/grades`, { grades });
    }
};
