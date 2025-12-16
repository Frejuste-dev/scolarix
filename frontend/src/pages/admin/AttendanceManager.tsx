import { useState, useEffect } from "react";
import { sessionService, type Session, type Attendance, type AttendanceStatus } from "@/services/sessionService";
import { classService, type ClassEntity } from "@/services/classService";
import { userService } from "@/services/userService";
import { type User } from "@/services/authService";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, Check, X, AlertCircle, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AttendanceManager() {
    const [classes, setClasses] = useState<ClassEntity[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const [students, setStudents] = useState<User[]>([]);
    const [attendanceMap, setAttendanceMap] = useState<Record<number, AttendanceStatus>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        classService.getClasses().then(data => {
            setClasses(data);
            if (data.length > 0) setSelectedClass(data[0].id.toString());
        });
    }, []);

    useEffect(() => {
        if (selectedClass) {
            loadSessions();
            userService.getUsers('STUDENT').then(setStudents);
            // In real app, filter students by class enrollment
        }
    }, [selectedClass, date]);

    const loadSessions = async () => {
        const data = await sessionService.getSessions(parseInt(selectedClass), date);
        setSessions(data);
    };

    const handleCreateSession = async () => {
        // Quick create for demo
        if (!selectedClass) return;
        const newSess = await sessionService.createSession({
            subject_id: 1, // Mock
            class_id: parseInt(selectedClass),
            teacher_id: 2, // Mock login teacher
            date: date,
            start_time: '08:00',
            end_time: '09:00',
            title: 'Nouveau cours'
        });
        loadSessions();
        handleSelectSession(newSess);
    };

    const handleSelectSession = async (session: Session) => {
        setSelectedSession(session);
        const atts = await sessionService.getAttendance(session.id);
        const map: Record<number, AttendanceStatus> = {};
        atts.forEach(a => map[a.student_id] = a.status);
        setAttendanceMap(map);
    };

    const handleMark = (studentId: number, status: AttendanceStatus) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    };

    const saveRoll = async () => {
        if (!selectedSession) return;
        setIsSaving(true);
        const list: Attendance[] = students.map(s => ({
            session_id: selectedSession.id,
            student_id: s.id,
            status: attendanceMap[s.id] || 'PRESENT' // Default Present
        }));
        await sessionService.saveAttendance(selectedSession.id, list);
        setIsSaving(false);
        alert("Présences enregistrées !");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Présences</h2>
                    <p className="text-gray-500">Gérez les sessions et l'appel.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="border p-2 rounded"
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                    >
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id.toString()}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <Button onClick={handleCreateSession}><Plus className="w-4 h-4 mr-2" /> Créer Session</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Sessions List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Sessions du jour</h3>
                    {sessions.map(sess => (
                        <div
                            key={sess.id}
                            onClick={() => handleSelectSession(sess)}
                            className={cn(
                                "p-4 border rounded-lg cursor-pointer transition-colors",
                                selectedSession?.id === sess.id ? "bg-primary/5 border-primary" : "hover:bg-gray-50"
                            )}
                        >
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-900">{sess.start_time} - {sess.end_time}</span>
                                <span className="text-sm text-gray-500">{sess.title}</span>
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && <p className="text-gray-500 italic">Aucune session.</p>}
                </div>

                {/* Roll Call */}
                <div className="md:col-span-2">
                    {selectedSession ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Feuille d'appel</CardTitle>
                                <Button onClick={saveRoll} disabled={isSaving}>
                                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {students.map(student => {
                                        const status = attendanceMap[student.id] || 'PRESENT';
                                        return (
                                            <div key={student.id} className="flex items-center justify-between p-3 border-b last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                                        {student.first_name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{student.first_name} {student.last_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <StatusBtn
                                                        current={status} target="PRESENT" icon={Check}
                                                        onClick={() => handleMark(student.id, 'PRESENT')} color="green" />
                                                    <StatusBtn
                                                        current={status} target="RETARD" icon={Clock3}
                                                        onClick={() => handleMark(student.id, 'RETARD')} color="orange" />
                                                    <StatusBtn
                                                        current={status} target="ABSENT" icon={X}
                                                        onClick={() => handleMark(student.id, 'ABSENT')} color="red" />
                                                    <StatusBtn
                                                        current={status} target="JUSTIFIE" icon={AlertCircle}
                                                        onClick={() => handleMark(student.id, 'JUSTIFIE')} color="blue" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50 text-gray-400">
                            Sélectionnez une session pour faire l'appel
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBtn({ current, target, icon: Icon, onClick, color }: any) {
    const isSelected = current === target;
    const colors = {
        green: "text-green-600 bg-green-50 hover:bg-green-100",
        orange: "text-orange-600 bg-orange-50 hover:bg-orange-100",
        red: "text-red-600 bg-red-50 hover:bg-red-100",
        blue: "text-blue-600 bg-blue-50 hover:bg-blue-100",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "p-2 rounded-md transition-all",
                isSelected ? `ring-2 ring-offset-1 ring-${color}-500 ${colors[color as keyof typeof colors]}` : "text-gray-300 hover:text-gray-500"
            )}
            title={target}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}
