import { useEffect, useState } from "react";

interface schedule {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
}

// --- Helper Functions & Components ---

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const Modal = ({ children, visible }: { children: React.ReactNode, visible: boolean }) => {
    if (!visible) return null;
    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                {children}
            </div>
        </div>
    );
};


// --- Main Component ---

function Manage() {
    const [visible, setVisible] = useState(false); // Default to true for development
    const [schedules, setSchedules] = useState<schedule[] | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<schedule | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");


    // --- NUI Message Handling ---
    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.data.action === "DGSC:NUI:Schedule:Response") {
                const scheduleData = event.data.schedules;
                const scheduleArray = Object.keys(scheduleData).map(key => ({
                    id: key,
                    ...scheduleData[key]
                }));
                setSchedules(scheduleArray);
            }
            if (event.data.action === "DGSC:NUI:Manage:Show") {
                setVisible(true);
            }

            if (event.data.action === "DGSC:NUI:Manage:Hide") {
                setVisible(false);
            }
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }

    }, []);

    useEffect(() => {
        if (isModalOpen) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            const defaultStartTime = now.toISOString().slice(0, 16);
            const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);

            setTitle(editingSchedule?.title || "");
            setDescription(editingSchedule?.description || "");
            setStartTime(editingSchedule?.startTime ? editingSchedule.startTime.slice(0, 16) : defaultStartTime);
            setEndTime(editingSchedule?.endTime ? editingSchedule.endTime.slice(0, 16) : defaultEndTime);
        }
    }, [isModalOpen, editingSchedule]);


    // --- Data Functions ---
    const sendMessage = (action: string, data?: Record<string, unknown>) => {
        fetch(`https://${GetParentResourceName()}/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    };

    const refresh = () => {
        sendMessage('DGSC:NUI:Schedule:Refresh');
    };

    const handleSave = () => {
        const scheduleData = { title, description, startTime, endTime };
        if (editingSchedule) {
            sendMessage('DGSC:NUI:Schedule:Edit', { id: editingSchedule.id, ...scheduleData });
        } else {
            sendMessage('DGSC:NUI:Schedule:Register', scheduleData);
        }
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        sendMessage('DGSC:NUI:Schedule:Delete', { id: id });
    };

    const closeMenu = () => {
        setVisible(false);
        sendMessage('DGSC:NUI:Manage:Hide');
    }

    // --- Render ---
    if (!visible) return null;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>スケジュール管理</h1>
                <div>
                    <button style={{...styles.button, ...styles.refreshButton}} onClick={refresh}>更新</button>
                    <button style={{...styles.button, ...styles.closeButton}} onClick={closeMenu}>閉じる</button>
                </div>
            </header>

            <div style={styles.actionBar}>
                <button style={{...styles.button, ...styles.addButton}} onClick={() => { setEditingSchedule(null); setModalOpen(true); }}>新しいスケジュールを登録</button>
            </div>

            <main style={styles.scheduleList}>
                {schedules && schedules.length > 0 ? (
                    schedules.map(schedule => (
                        <div key={schedule.id} style={styles.scheduleItem}>
                            <div style={styles.scheduleContent}>
                                <h2 style={styles.scheduleTitle}>{schedule.title}</h2>
                                <p style={styles.scheduleDescription}>{schedule.description}</p>
                                <div style={styles.scheduleTimes}>
                                    <span><strong>開始:</strong> {formatDate(schedule.startTime)}</span>
                                    <span><strong>終了:</strong> {formatDate(schedule.endTime)}</span>
                                </div>
                            </div>
                            <div style={styles.scheduleActions}>
                                <button style={{...styles.button, ...styles.editButton}} onClick={() => { setEditingSchedule(schedule); setModalOpen(true); }}>編集</button>
                                <button style={{...styles.button, ...styles.deleteButton}} onClick={() => handleDelete(schedule.id)}>削除</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>現在登録されているスケジュールはありません。</p>
                )}
            </main>

            <Modal visible={isModalOpen}>
                <h2 style={styles.modalTitle}>{editingSchedule ? "スケジュールを編集" : "新しいスケジュールを登録"}</h2>
                <div style={styles.form}>
                    <input type="text" placeholder="タイトル" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
                    <textarea placeholder="説明" value={description} onChange={e => setDescription(e.target.value)} style={styles.textarea} rows={4}></textarea>
                    <label style={styles.label}>開始日時</label>
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={styles.input} />
                    <label style={styles.label}>終了日時</label>
                    <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.modalActions}>
                    <button style={{...styles.button, ...styles.cancelButton}} onClick={() => setModalOpen(false)}>キャンセル</button>
                    <button style={{...styles.button, ...styles.saveButton}} onClick={handleSave}>保存</button>
                </div>
            </Modal>
        </div>
    );
}

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '75vh', maxWidth: '1000px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        color: '#e2e8f0',
        borderRadius: '12px',
        border: '1px solid #334155',
        display: 'flex', flexDirection: 'column',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #334155',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
    },
    title: { margin: 0, fontSize: '24px', fontWeight: 600, color: '#f1f5f9' },
    actionBar: { padding: '16px 24px' },
    button: {
        padding: '8px 16px', borderRadius: '6px', border: 'none',
        cursor: 'pointer', fontWeight: 500, fontSize: '14px',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    },
    addButton: { backgroundColor: '#3b82f6', color: 'white' },
    refreshButton: { backgroundColor: '#0ea5e9', color: 'white', marginRight: '10px' },
    closeButton: { backgroundColor: '#64748b', color: 'white' },
    scheduleList: { flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' },
    scheduleItem: {
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #334155',
    },
    scheduleContent: { flex: 1 },
    scheduleTitle: { margin: '0 0 8px 0', fontSize: '18px', color: '#f1f5f9' },
    scheduleDescription: { margin: '0 0 12px 0', color: '#94a3b8', fontSize: '14px' },
    scheduleTimes: { display: 'flex', gap: '16px', fontSize: '12px', color: '#cbd5e1' },
    scheduleActions: { display: 'flex', gap: '10px' },
    editButton: { backgroundColor: '#f59e0b', color: 'white' },
    deleteButton: { backgroundColor: '#ef4444', color: 'white' },
    modalBackdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1e293b',
        padding: '24px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        border: '1px solid #475569',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
    modalTitle: { marginTop: 0, marginBottom: '20px', color: '#f1f5f9' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    label: { fontSize: '14px', color: '#94a3b8', marginBottom: '-8px' },
    input: {
        padding: '10px', borderRadius: '6px', border: '1px solid #475569',
        backgroundColor: '#334155', color: '#f1f5f9', fontSize: '14px',
    },
    textarea: {
        padding: '10px', borderRadius: '6px', border: '1px solid #475569',
        backgroundColor: '#334155', color: '#f1f5f9', fontSize: '14px',
        resize: 'vertical',
    },
    modalActions: {
        display: 'flex', justifyContent: 'flex-end', gap: '12px',
        marginTop: '24px',
    },
    cancelButton: { backgroundColor: '#64748b', color: 'white' },
    saveButton: { backgroundColor: '#22c55e', color: 'white' },
};

export default Manage;
