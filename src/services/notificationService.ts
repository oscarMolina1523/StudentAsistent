let notifications : any [];

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`);
    const allNotifications = response.data;

    const userId = await AsyncStorage.getItem('userId');
    const userRole = await AsyncStorage.getItem('userRole');

    if (userRole === 'admin') {
      return allNotifications; // Admin ve todas
    }

    // Los tutores ven solo las de sus hijos
    const filtered = allNotifications.filter(
      (notification: any) => notification.tutorId === userId
    );

    return filtered;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const getPaginatedNotifications = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/paginated`, {
      params: {
        page,
        page_size: pageSize,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener las notificaciones paginadas',
    };
  }
};


export const addNotification = (message: string) => {
  const newNotification = { id: notifications.length + 1, message };
  notifications = [newNotification, ...notifications];
};
