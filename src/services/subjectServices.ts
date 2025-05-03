// services/subjectService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Obtener las relaciones entre grados y materias
export const getGradeSubjectRelations = async (gradeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grade-subjects/${gradeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching grade-subject relations:', error);
    throw error;
  }
};

// Obtener los detalles de una materia por su ID
export const getSubjectDetails = async (subjectId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subject details:', error);
    throw error;
  }
};

// Obtener las materias de un grado con sus detalles
export const getSubjectsByGrade = async (gradeId: string) => {
  try {
    // Obtener las relaciones entre grados y materias
    const relations = await getGradeSubjectRelations(gradeId);

    // Obtener los detalles de cada materia
    const subjectDetailsPromises = relations.map((relation: any) =>
      getSubjectDetails(relation.materiaId)
    );

    const subjects = await Promise.all(subjectDetailsPromises);
    return subjects;
  } catch (error) {
    console.error('Error fetching subjects by grade:', error);
    throw error;
  }
};


export const getGradeById = async (gradeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/${gradeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching grade by ID:', error);
    throw error;
  }
};