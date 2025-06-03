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


export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al obtener los estudiantes' };
  }
};

// Función para obtener un estudiante por ID
export const getStudentById = async (studentId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al obtener el estudiante' };
  }
};

// Función para crear un nuevo estudiante
export const createStudent = async (studentData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students`, studentData);
    return { success: true, message: 'Estudiante creado exitosamente', data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al crear el estudiante' };
  }
};

// Función para actualizar un estudiante
export const updateStudent = async (studentId: string, studentData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/students/${studentId}`, studentData);
    return { success: true, message: 'Estudiante actualizado exitosamente', data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al actualizar el estudiante' };
  }
};

// Función para eliminar un estudiante
export const deleteStudent = async (studentId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/students/${studentId}`);
    return { success: true, message: 'Estudiante eliminado exitosamente' };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.detail || 'Error al eliminar el estudiante' };
  }
};