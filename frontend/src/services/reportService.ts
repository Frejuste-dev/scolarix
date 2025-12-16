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

export const reportService = {
    async getStudentReport(studentId: number, periodId: number): Promise<StudentReport> {
        const response = await api.get(`/reports/student/${studentId}`, { params: { period_id: periodId } });
        return response.data;
    },

    async getClassReports(classId: number, periodId: number): Promise<StudentReport[]> {
        const response = await api.get(`/reports/class/${classId}`, { params: { period_id: periodId } });
        return response.data;
    }
};
