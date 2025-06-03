// services/attendanceService.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { AttendanceData, AttendanceSummary } from '../models/Models';


export const markAttendance = async (data: AttendanceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/attendance/mark`, data);
    return response.data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

export const getAttendanceSummary = async (): Promise<AttendanceSummary[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/attendance/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    throw error;
  }
};
