import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);


    console.log('Login response:', response.data); // Debugging response

    const { idToken, refreshToken, expiresIn } = response.data;

    await AsyncStorage.setItem('idToken', idToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return { success: true, idToken, refreshToken, expiresIn };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message); // Debugging error

    let errorMessage = 'Email o contraseña incorrectos';

    if (error.response?.data?.detail) {
      errorMessage = Array.isArray(error.response.data.detail)
        ? error.response.data.detail.join(', ')
        : error.response.data.detail;
    }

    return { success: false, message: errorMessage };
  }
};

export const register = async (email: string, password: string, role: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      nombre:"",
      email,
      password,
      role,
    });
    return { success: true, message: 'Registro exitoso' };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al registrarse' };
  }
};