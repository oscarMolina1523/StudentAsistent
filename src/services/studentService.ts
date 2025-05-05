import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';


export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: 'Error al obtener los estudiantes' };
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: 'Error al obtener el estudiante' };
  }
};

export const createStudent = async (studentData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students`, studentData);
    return { success: true, message: 'Estudiante creado exitosamente' };
  } catch (error) {
    return { success: false, message: 'Error al crear el estudiante' };
  }
};

export const updateStudent = async (id: string, studentData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/students/${id}`, studentData);
    return { success: true, message: 'Estudiante actualizado exitosamente' };
  } catch (error) {
    return { success: false, message: 'Error al actualizar el estudiante' };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/students/${id}`);
    return { success: true, message: 'Estudiante eliminado exitosamente' };
  } catch (error) {
    return { success: false, message: 'Error al eliminar el estudiante' };
  }
};
