// services/subjectService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const getSubjectsByGrade = async (gradeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grade-subjects/${gradeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};
