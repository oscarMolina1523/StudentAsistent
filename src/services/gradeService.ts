import axios from 'axios';

const API_BASE_URL = 'https://backend-fastapi-ten.vercel.app'; // URL de tu API

// Definir la interfaz para el grado
export interface Grade {
  id: string;
  nombre: string;
  descripcion: string;
  turno: string;
  imagenUrl: string;
}

// Obtener todos los grados
export const fetchGrades = async (): Promise<Grade[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los grados');
  }
};

// Crear un nuevo grado
export const createGrade = async (gradeData: Grade): Promise<Grade> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/grades`, gradeData);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el grado');
  }
};

// Actualizar un grado existente
export const updateGrade = async (gradeId: string, gradeData: Grade): Promise<Grade> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/grades/${gradeId}`, gradeData);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el grado');
  }
};

// Eliminar un grado
export const deleteGrade = async (gradeId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/grades/${gradeId}`);
  } catch (error) {
    throw new Error('Error al eliminar el grado');
  }
};
