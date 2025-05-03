import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

// Helper para obtener los encabezados con el token
const getAuthHeaders = async () => {
  const idToken = await AsyncStorage.getItem('idToken');
  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
};

// Función de Login
export const login = async (email: string, password: string) => {
  try {
    // 1. Realizamos la solicitud de login
    const response = await axios.post(`${API_BASE_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

    console.log('Login response:', response.data); // Depuración de la respuesta

    // 2. Extraemos los tokens
    const { idToken, refreshToken, expiresIn } = response.data;

    // 3. Guardamos los tokens en AsyncStorage
    await AsyncStorage.setItem('idToken', idToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    // 4. Guardamos el email en AsyncStorage
    await AsyncStorage.setItem('email', email);

    // 5. Llamamos a la API para obtener todos los usuarios
    const usersResponse = await axios.get(`${API_BASE_URL}/users`, await getAuthHeaders());

    // 6. Buscamos al usuario cuyo email coincida con el que se autenticó
    const user = usersResponse.data.find((user: any) => user.email === email);

    if (user) {
      // 7. Almacenamos el ID y el rol del usuario
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userRole', user.rol); // Asegúrate de que 'rol' es la propiedad correcta

      console.log('User found:', user); // Depuración
    }

    // Retornamos el estado de éxito
    return { success: true, idToken, refreshToken, expiresIn };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message); // Depuración de errores

    let errorMessage = 'Email o contraseña incorrectos';

    if (error.response?.data?.detail) {
      errorMessage = Array.isArray(error.response.data.detail)
        ? error.response.data.detail.join(', ')
        : error.response.data.detail;
    }

    return { success: false, message: errorMessage };
  }
};

// Función de Registro
export const register = async (name: string, email: string, password: string, role: string) => {
  try {
    // 1. Realizamos la solicitud de registro
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      nombre: name,
      email,
      password,
      rol: role,
      fotoPerfilUrl: "https://cdn-icons-png.flaticon.com/512/10015/10015419.png",
      fechaCreacion: new Date().toISOString(),
    });

    console.log('Register response:', response.data); // Depuración

    // 2. Realizamos el login automático después del registro
    return login(email, password);
  } catch (error: any) {
    console.error('Register error:', error.response?.data || error.message); // Depuración de errores

    return { success: false, message: error.response?.data?.detail || 'Error al registrarse' };
  }
};
