// services/attendanceService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

type AttendanceData = {
  alumnoId: string;
  materiaId: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'justificado';
  justificacion?: string;
  registradoPor: string;
  horaRegistro: string;
};

export const markAttendance = async (data: AttendanceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/attendance/mark`, data);
    return response.data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};
