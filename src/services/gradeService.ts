import axios from 'axios';
import { Grade } from '../models/Models';
import { API_BASE_URL } from '../utils/constants';


// Obtener todos los grados
export const fetchGrades = async (): Promise<Grade[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los grados');
  }
};

export const getGradeById = async (gradeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/${gradeId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error al obtener el grado:', error);
    return {
      success: false,
      message:
        error.response?.data?.detail || 'Error al obtener el grado',
    };
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
