import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("https://studentasistentbackend-production.up.railway.app/auth/login", {
      email,
      password,
    });

    // Extract the idToken, refreshToken, and expiresIn from the response
    const { idToken, refreshToken, expiresIn } = response.data;

    // Save the idToken and refreshToken using AsyncStorage
    await AsyncStorage.setItem('idToken', idToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return { success: true, idToken, refreshToken, expiresIn };
  } catch (error: any) {
    // Handle error responses, including 400 status code
    const errorMessage = error.response?.data?.detail || 'Email o contraseña incorrectos';
    return { success: false, message: errorMessage };
  }
};

export const register = async (email: string, password: string, role: string) => {
  try {
    const response = await axios.post("https://studentasistentbackend-production.up.railway.app/auth/register", {
      email,
      password,
      role,
    });
    return { success: true, message: 'Registro exitoso' };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al registrarse' };
  }
};
