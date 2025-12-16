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

// MOCK DATA
let MOCK_EVALUATIONS: Evaluation[] = [
    { id: 1, subject_id: 1, class_id: 101, period_id: 2, type: 'CONTROLE', date: '2025-01-15', max_score: 20, title: 'Algèbre chap 1' },
];

let MOCK_GRADES: Grade[] = [
    { id: 1, evaluation_id: 1, student_id: 3, score: 15.5 },
    { id: 2, evaluation_id: 1, student_id: 4, score: 12 },
];

export const evaluationService = {
    async getEvaluations(classId: number, subjectId: number, periodId: number): Promise<Evaluation[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 400));
            return MOCK_EVALUATIONS.filter(e =>
                e.class_id === classId &&
                e.subject_id === subjectId &&
                e.period_id === periodId
            );
        }
        const response = await api.get('/evaluations', { params: { class_id: classId, subject_id: subjectId, period_id: periodId } });
        return response.data;
    },

    async createEvaluation(data: Omit<Evaluation, 'id'>): Promise<Evaluation> {
        if (import.meta.env.DEV) {
            const newEval = { ...data, id: Date.now() };
            MOCK_EVALUATIONS.push(newEval);
            return newEval;
        }
        const response = await api.post('/evaluations', data);
        return response.data;
    },

    async saveGrades(evaluationId: number, grades: { student_id: number, score: number }[]): Promise<void> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 600));
            grades.forEach(g => {
                const existing = MOCK_GRADES.find(gr => gr.evaluation_id === evaluationId && gr.student_id === g.student_id);
                if (existing) {
                    existing.score = g.score;
                } else {
                    MOCK_GRADES.push({ id: Date.now() + Math.random(), evaluation_id: evaluationId, ...g });
                }
            });
            return;
        }
        await api.post(`/evaluations/${evaluationId}/grades`, { grades });
    }
};
