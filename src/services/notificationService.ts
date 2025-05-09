let notifications = [];

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://backend-fastapi-ten.vercel.app';

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`);
    const allNotifications = response.data;

    const userId = await AsyncStorage.getItem('userId');
    const userRole = await AsyncStorage.getItem('userRole');

    if (userRole === 'admin') {
      return allNotifications; // Admin ve todas
    }

    // Tutor solo ve las suyas
    const filtered = allNotifications.filter(
      (notification: any) => notification.tutorId === userId
    );

    return filtered;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};


export const addNotification = (message: string) => {
  const newNotification = { id: notifications.length + 1, message };
  notifications = [newNotification, ...notifications];
};
