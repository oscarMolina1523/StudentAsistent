import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';
import { TutorStudentRelation } from '../models/Models';

// Helper para obtener el token almacenado
const getAuthHeaders = async () => {
  const idToken = await AsyncStorage.getItem('idToken');
  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
};

// Crear relación Tutor - Alumno
export const createTutorStudentRelation = async (tutorId: string, alumnoId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tutor-student`,
      { tutorId, alumnoId },
      await getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear la relación tutor-alumno',
    };
  }
};

// Crear relación Profesor - Materia
export const createProfessorSubjectRelation = async (
  profesorId: string,
  materiaGradoId: string,
  turno: string,
  anioEscolar: number
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/professor-subjects`,
      { profesorId, materiaGradoId, turno, anioEscolar }, // ← Usar materiaGradoId aquí
      await getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear la relación profesor-materia',
    };
  }
};

// Crear relación Grado - Materia
export const createGradeSubjectRelation = async (gradoId: string, materiaId: string, semestre: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/grade-subjects`,
      [{ gradoId, materiaId, semestre }],
      await getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear la relación grado-materia',
    };
  }
};

// Crear cualquier otra relación
export const createCustomRelation = async (url: string, data: any) => {
  try {
    const response = await axios.post(url, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al crear la relación personalizada',
    };
  }
};

// Obtener todas las relaciones grado-materia
export const getAllGradeSubjectRelations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grade-subjects`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error al obtener las relaciones grado-materia',
    };
  }
};

export const getTutorStudentRelations = async (): Promise<TutorStudentRelation[]> => {
  const response = await axios.get<TutorStudentRelation[]>(`${API_BASE_URL}/tutor-student`);
  return response.data;
};