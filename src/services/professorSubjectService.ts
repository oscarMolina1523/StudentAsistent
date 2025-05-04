// services/professorSubjectService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Obtener estudiantes y el materiaProfesorId asociado con una materia
export const getStudentsInSubject = async (materiaGradoId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professor-subjects/${materiaGradoId}/students`);
    return response.data;  // Devuelve los datos de los estudiantes y la relación de materia-profesor
  } catch (error) {
    console.error('Error fetching students in subject:', error);
    throw error;
  }
};
