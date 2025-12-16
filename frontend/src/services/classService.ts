import { api } from './api';

export interface Filiere {
    id: number;
    name: string;
    description: string;
}

export interface ClassEntity {
    id: number;
    name: string;
    level: string;
    filiere_id: number;
    academic_year_id: number;
    filiere?: Filiere; // Hydrated for display
}

// MOCK DATA
let MOCK_FILIERES: Filiere[] = [
    { id: 1, name: 'Sixième', description: 'Cycle Collège' },
    { id: 2, name: 'Terminale S', description: 'Cycle Lycée Scientifique' },
    { id: 3, name: 'Terminale L', description: 'Cycle Lycée Littéraire' },
];

let MOCK_CLASSES: ClassEntity[] = [
    { id: 101, name: '6ème A', level: '6ème', filiere_id: 1, academic_year_id: 2024 },
    { id: 102, name: '6ème B', level: '6ème', filiere_id: 1, academic_year_id: 2024 },
    { id: 201, name: 'Tle S1', level: 'Terminale', filiere_id: 2, academic_year_id: 2024 },
];

export const classService = {
    // FILIERES
    async getFilieres(): Promise<Filiere[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 400));
            return [...MOCK_FILIERES];
        }
        const response = await api.get('/filieres');
        return response.data;
    },

    async createFiliere(data: Omit<Filiere, 'id'>): Promise<Filiere> {
        if (import.meta.env.DEV) {
            const newFiliere = { ...data, id: Date.now() };
            MOCK_FILIERES.push(newFiliere);
            return newFiliere;
        }
        const response = await api.post('/filieres', data);
        return response.data;
    },

    // CLASSES
    async getClasses(yearId?: number): Promise<ClassEntity[]> {
        if (import.meta.env.DEV) {
            await new Promise(r => setTimeout(r, 400));
            let classes = [...MOCK_CLASSES];
            if (yearId) {
                classes = classes.filter(c => c.academic_year_id === yearId);
            }
            // Simulate Join
            return classes.map(c => ({
                ...c,
                filiere: MOCK_FILIERES.find(f => f.id === c.filiere_id)
            }));
        }
        const response = await api.get('/classes', { params: { year_id: yearId } });
        return response.data;
    },

    async createClass(data: Omit<ClassEntity, 'id'>): Promise<ClassEntity> {
        if (import.meta.env.DEV) {
            const newClass = { ...data, id: Date.now() } as ClassEntity;
            // manual hydration for mock return
            newClass.filiere = MOCK_FILIERES.find(f => f.id === newClass.filiere_id);
            MOCK_CLASSES.push(newClass);
            return newClass;
        }
        const response = await api.post('/classes', data);
        return response.data;
    },

    async deleteClass(id: number): Promise<void> {
        if (import.meta.env.DEV) {
            MOCK_CLASSES = MOCK_CLASSES.filter(c => c.id !== id);
            return;
        }
        await api.delete(`/classes/${id}`);
    }
};
