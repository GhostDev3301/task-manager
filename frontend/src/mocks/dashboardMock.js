export const getDashboardData = () => {
  return Promise.resolve({
    tasks: [
      {
        id: '1',
        title: 'Tarea próxima',
        endDate: new Date(Date.now() + 86400000).toISOString() // Mañana
      }
    ],
    meetings: [
      {
        id: 'm1',
        title: 'Reunión de equipo',
        date: new Date().toISOString(),
        time: '15:00'
      }
    ],
    stats: {
      tasksThisWeek: 5,
      completedTasks: 3,
      meetingsThisWeek: 2,
      pendingTasks: 2
    }
  });
};