let notifications = [
  { id: 1, message: 'Juan Perez no asistio el 2023-10-01' },
  { id: 2, message: 'Maria Lopez no asistio el 2023-10-02' },
  { id: 3, message: 'Carlos Sanchez no asistio el 2023-10-03' },
];

export const getNotifications = () => notifications;

export const addNotification = (message: string) => {
  const newNotification = { id: notifications.length + 1, message };
  notifications = [newNotification, ...notifications];
};
