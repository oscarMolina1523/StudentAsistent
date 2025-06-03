import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { ProfessorSubject, Subject } from '../models/Models';

export const getSubjectsByProfessorId = async (
  profesorId: string
): Promise<ProfessorSubject[]> => {
  try {
    const response = await axios.get<ProfessorSubject[]>(
      `${API_BASE_URL}/professor-subjects/${profesorId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching professor subjects:', error);
    throw error;
  }
}

// ----------------------
// FUNCIONES RELACIONADAS A MATERIA-GRADO
// ----------------------

export const getGradeSubjectRelations = async (gradeId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grade-subjects/${gradeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching grade-subject relations:', error);
    throw error;
  }
};

export const getSubjectDetails = async (subjectId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subject details:', error);
    throw error;
  }
};

export const getSubjectsByGrade = async (gradeId: string) => {
  try {
    const relations = await getGradeSubjectRelations(gradeId);
    const subjectDetailsPromises = relations.map(async (relation: any) => {
      const subject = await getSubjectDetails(relation.materiaId);
      return { ...subject, materiaGradoId: relation.id };
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

// ----------------------
// CRUD DE MATERIAS
// ----------------------

export const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await axios.get(`${API_BASE_URL}/subjects`);
  return response.data;
};

export const createSubject = async (subject: Omit<Subject, 'id'>): Promise<void> => {
  await axios.post(`${API_BASE_URL}/subjects`, subject);
};

export const updateSubject = async (id: string, subject: Omit<Subject, 'id'>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/subjects/${id}`, subject);
};

export const deleteSubject = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/subjects/${id}`);
};
