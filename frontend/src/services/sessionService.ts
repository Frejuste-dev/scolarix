import { api } from './api';

export interface Session {
    id: number;
    subject_id: number;
    class_id: number;
    teacher_id: number;
    date: string;
    start_time: string;
    end_time: string;
    title?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE';

export interface Attendance {
    session_id: number;
    student_id: number;
    status: AttendanceStatus;
    comment?: string;
}

export const sessionService = {
    async getSessions(classId: number, date?: string): Promise<Session[]> {
        const response = await api.get('/sessions', { params: { class_id: classId, date } });
        return response.data;
    },

    async createSession(data: Omit<Session, 'id'>): Promise<Session> {
        const response = await api.post('/sessions', data);
        return response.data;
    },

    async getAttendance(sessionId: number): Promise<Attendance[]> {
        const response = await api.get(`/sessions/${sessionId}/attendance`);
        return response.data;
    },

    async saveAttendance(sessionId: number, attendances: Attendance[]): Promise<void> {
        await api.post(`/sessions/${sessionId}/attendance`, { attendances });
    }
};
