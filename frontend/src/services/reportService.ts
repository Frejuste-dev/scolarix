import { api } from './api';
import { type User } from './authService';
import { type Subject } from './subjectService';

export interface StudentReport {
    student: User;
    period_id: number;
    subject_grades: {
        subject: Subject;
        average: number;
        rank?: number;
    }[];
    global_average: number;
    class_presences: number;
    class_absences: number;
}

// MOCK DATA GENERATOR
const generateMockReport = (studentId: number, periodId: number): StudentReport => {
    return {
        student: { id: studentId, first_name: 'Alice', last_name: 'Eleve', email: 'alice@test.com', role: 'STUDENT' },
        period_id: periodId,
        subject_grades: [
            { subject: { id: 1, name: 'Mathématiques', coefficient: 5 }, average: 15.5, rank: 3 },
            { subject: { id: 2, name: 'Français', coefficient: 4 }, average: 14.0, rank: 5 },
            { subject: { id: 3, name: 'Anglais', coefficient: 3 }, average: 16.5, rank: 1 },
        ],
        global_average: 15.2,
        class_presences: 45,
        class_absences: 2
    };
};

export const reportService = {
    async getStudentReport(studentId: number, periodId: number): Promise<StudentReport> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 800));
            return generateMockReport(studentId, periodId);
        }
        const response = await api.get(`/reports/student/${studentId}`, { params: { period_id: periodId } });
        return response.data;
    },

    async getClassReports(classId: number, periodId: number): Promise<StudentReport[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 800));
            // Mock for class list
            return [
                generateMockReport(3, periodId),
                { ...generateMockReport(4, periodId), student: { id: 4, first_name: 'Bob', last_name: 'Eleve', email: 'bob@test.com', role: 'STUDENT' }, global_average: 12.5 }
            ];
        }
        const response = await api.get(`/reports/class/${classId}`, { params: { period_id: periodId } });
        return response.data;
    }
};
