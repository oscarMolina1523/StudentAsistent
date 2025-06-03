// services/professorSubjectService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { ProfessorSubject } from '../models/Models';


// Obtener estudiantes y el materiaProfesorId asociado con una materia
export const getStudentsInSubject = async (materiaGradoId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professor-subjects/${materiaGradoId}/students`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching students in subject:', error);
    throw error;
  }
};


export const getAllProfessorSubjects = async (): Promise<ProfessorSubject[]> => {
  try {
    const response = await axios.get<ProfessorSubject[]>(
      `${API_BASE_URL}/professor-subjects`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all professor-subject relations:', error);
    throw error;
  }
}