import { api } from './api';

export interface Subject {
    id: number;
    name: string;
    coefficient: number;
}

export interface ClassSubject {
    id: number;
    class_id: number;
    subject_id: number;
    teacher_id: number;
    subject?: Subject; // Hydrated
}

// MOCK DATA
let MOCK_SUBJECTS: Subject[] = [
    { id: 1, name: 'Mathématiques', coefficient: 5 },
    { id: 2, name: 'Français', coefficient: 4 },
    { id: 3, name: 'Anglais', coefficient: 3 },
    { id: 4, name: 'Physique-Chimie', coefficient: 4 },
];

let MOCK_CLASS_SUBJECTS: ClassSubject[] = [
    { id: 10, class_id: 101, subject_id: 1, teacher_id: 2 }, // Maths for 6A by Prof Jean
    { id: 11, class_id: 101, subject_id: 2, teacher_id: 5 }, // French for 6A by Marie Curie
];

export const subjectService = {
    async getSubjects(): Promise<Subject[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 300));
            return [...MOCK_SUBJECTS];
        }
        const response = await api.get('/subjects');
        return response.data;
    },

    async getClassSubjects(classId: number): Promise<ClassSubject[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 300));
            return MOCK_CLASS_SUBJECTS
                .filter(cs => cs.class_id === classId)
                .map(cs => ({
                    ...cs,
                    subject: MOCK_SUBJECTS.find(s => s.id === cs.subject_id)
                }));
        }
        const response = await api.get('/class-subjects', { params: { class_id: classId } });
        return response.data;
    },

    // Teacher View: Get my subjects
    async getTeacherSubjects(teacherId: number): Promise<ClassSubject[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 300));
            return MOCK_CLASS_SUBJECTS
                .filter(cs => cs.teacher_id === teacherId)
                .map(cs => ({
                    ...cs,
                    subject: MOCK_SUBJECTS.find(s => s.id === cs.subject_id)
                }));
        }
        const response = await api.get('/class-subjects/my', { params: { teacher_id: teacherId } });
        return response.data;
    }
};
