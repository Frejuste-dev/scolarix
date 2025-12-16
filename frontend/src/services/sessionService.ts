import { api } from './api';
// User interface is not used here directly in service logic currently


export interface Session {
    id: number;
    subject_id: number;
    class_id: number;
    teacher_id: number;
    date: string;       // YYYY-MM-DD
    start_time: string; // HH:mm
    end_time: string;   // HH:mm
    title?: string;     // e.g. "Cours magistral"
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE';

export interface Attendance {
    session_id: number;
    student_id: number;
    status: AttendanceStatus;
    comment?: string;
}

// MOCK DATA
let MOCK_SESSIONS: Session[] = [
    { id: 1, subject_id: 1, class_id: 101, teacher_id: 2, date: '2025-01-14', start_time: '08:00', end_time: '10:00', title: 'Algèbre Intro' },
];

let MOCK_ATTENDANCES: Attendance[] = [];

export const sessionService = {
    // GET Sessions (filtered by class/date)
    async getSessions(classId: number, date?: string): Promise<Session[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 400));
            return MOCK_SESSIONS.filter(s => s.class_id === classId && (!date || s.date === date));
        }
        const response = await api.get('/sessions', { params: { class_id: classId, date } });
        return response.data;
    },

    async createSession(data: Omit<Session, 'id'>): Promise<Session> {
        if (import.meta.env.DEV) {
            const newSession = { ...data, id: Date.now() };
            MOCK_SESSIONS.push(newSession);
            return newSession;
        }
        const response = await api.post('/sessions', data);
        return response.data;
    },

    // GET Attendance for a session
    async getAttendance(sessionId: number): Promise<Attendance[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 400));
            return MOCK_ATTENDANCES.filter(a => a.session_id === sessionId);
        }
        const response = await api.get(`/sessions/${sessionId}/attendance`);
        return response.data;
    },

    // SAVE Attendance
    async saveAttendance(sessionId: number, attendances: Attendance[]): Promise<void> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 600));
            // remove old
            MOCK_ATTENDANCES = MOCK_ATTENDANCES.filter(a => a.session_id !== sessionId);
            // add new
            MOCK_ATTENDANCES.push(...attendances);
            return;
        }
        await api.post(`/sessions/${sessionId}/attendance`, { attendances });
    }
};
