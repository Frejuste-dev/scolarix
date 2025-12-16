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
    subject?: Subject;
}

export const subjectService = {
    async getSubjects(): Promise<Subject[]> {
        const response = await api.get('/subjects');
        return response.data;
    },

    async getClassSubjects(classId: number): Promise<ClassSubject[]> {
        const response = await api.get('/class-subjects', { params: { class_id: classId } });
        return response.data;
    },

    async getTeacherSubjects(teacherId: number): Promise<ClassSubject[]> {
        const response = await api.get('/class-subjects/my', { params: { teacher_id: teacherId } });
        return response.data;
    }
};
