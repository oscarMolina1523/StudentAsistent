import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

// Helper para obtener el token almacenado
const getAuthHeaders = async () => {
  const idToken = await AsyncStorage.getItem('idToken');
  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
};

// Obtener datos del usuario por ID
export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, await getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al obtener el usuario' };
  }
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, await getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al obtener los usuarios' };
  }
};

// Obtener usuarios por rol (admin, profesor, tutor)
export const getUsersByRole = async (rol: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/by-role/${rol}`, await getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al obtener usuarios por rol' };
  }
};

// Editar perfil de usuario (requiere pasar el ID y el objeto user)
export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/edit-profile?user_id=${userId}`,
      userData,
      await getAuthHeaders()
    );
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al actualizar el usuario',
    };
  }
};


// Eliminar usuario
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, await getAuthHeaders());
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al eliminar el usuario' };
  }
};

// Obtener la info extendida del usuario logeado (alumno, tutor, profesor)
export const getUserExtendedInfo = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/info`, await getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al obtener la información del usuario' };
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users`,
      userData,
      await getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear el usuario',
    };
  }
};

// Obtener usuarios paginados
export const getPaginatedUsers = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/paginated`, {
      params: { page, page_size: pageSize },
      ...(await getAuthHeaders()),
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener los usuarios paginados',
    };
  }
};
