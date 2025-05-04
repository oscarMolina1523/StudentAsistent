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
    const relations = await getGradeSubjectRelations(gradeId);
    const subjectDetailsPromises = relations.map(async (relation: any) => {
      const subject = await getSubjectDetails(relation.materiaId);
      return { ...subject,  materiaGradoId: relation.id, }; // Agrega esta línea
    });

    return await Promise.all(subjectDetailsPromises);
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

// Obtener la materiaId a partir de una relación materia-grado
export const getMateriaIdByMateriaGradoId = async (materiaGradoId: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grade-subjects`);
    const relations = response.data;
    const relation = relations.find((r: any) => r.id === materiaGradoId);
    return relation ? relation.materiaId : null;
  } catch (error) {
    console.error('Error fetching materiaId by materiaGradoId:', error);
    throw error;
  }
};
