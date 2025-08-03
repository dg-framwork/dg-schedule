import { useEffect, useState } from 'react';

interface schedule {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
}

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

function Schedule() {
    const [visible, setVisible] = useState(true);
    const [schedules, setSchedules] = useState<schedule[] | null>([]);

    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.data.action === "DGSC:NUI:Schedule:Show") {
                setVisible(true);
            }

            if (event.data.action === "DGSC:NUI:Schedule:Hide") {
                setVisible(false);
            }

            if (event.data.action === "DGSC:NUI:Schedule:Response") {
                const scheduleData = event.data.schedules;
                const scheduleArray = Object.keys(scheduleData).map(key => ({
                    id: key,
                    ...scheduleData[key]
                }));
                setSchedules(scheduleArray);
            }
        });
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '0.8rem', // Smaller padding
            borderRadius: '8px',
            width: '300px', // Smaller width
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '1.3rem', marginTop: 0, marginBottom: '0.8rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>
                Schedule
            </h1>
            <div>
                {schedules && schedules.length > 0 ? (
                    schedules.map((schedule, index) => (
                        <div key={index} style={{ marginBottom: '0.8rem' }}>
                            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{schedule.title}</h2>
                            <p style={{ margin: '0.4rem 0', opacity: 0.9, fontSize: '0.9rem' }}>{schedule.description}</p>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                <p>Start: {formatDate(schedule.startTime)}</p>
                                <p>End: {formatDate(schedule.endTime)}</p>
                            </div>
                        </div>
                    ))
                ) : (null)}
            </div>
        </div>
    );
}

export default Schedule;