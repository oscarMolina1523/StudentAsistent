// services/studentService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const getStudentsBySubjectGrade = async (materiaGradoId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professor-subjects/${materiaGradoId}/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students by subject-grade ID:', error);
    throw error;
  }
};
