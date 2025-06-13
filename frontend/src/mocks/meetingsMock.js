let meetings = [
  {
    id: '1',
    title: 'Reunión de equipo',
    description: 'Planificación semanal',
    date: new Date().toISOString().slice(0, 10),
    time: '15:00',
    googleCalendar: false,
  }
];

export const getMeetings = async () => meetings;

export const createMeeting = async (meeting) => {
  const newMeeting = { ...meeting, id: Date.now().toString() };
  meetings.push(newMeeting);
  return newMeeting;
};

export const deleteMeeting = async (id) => {
  meetings = meetings.filter(m => m.id !== id);
};

export const syncMeetingWithGoogle = async (id) => {
  meetings = meetings.map(m =>
    m.id === id ? { ...m, googleCalendar: true } : m
  );
};