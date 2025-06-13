let notifications = [
  {
    id: '1',
    title: 'Tarea asignada',
    message: 'Se te ha asignado una nueva tarea.',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Reunión programada',
    message: 'Tienes una reunión programada para mañana.',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    read: false,
  }
];

export const getNotifications = async () => notifications;

export const markNotificationAsRead = async (id) => {
  notifications = notifications.map(n =>
    n.id === id ? { ...n, read: true } : n
  );
};

export const markAllNotificationsAsRead = async () => {
  notifications = notifications.map(n => ({ ...n, read: true }));
};