// attendanceCache.ts
import { getAttendanceSummary as fetchAttendanceSummary } from './attendanceService';

let attendanceData: any[] | null = null;
let loadingPromise: Promise<any[]> | null = null;

export const preloadAttendanceSummary = async () => {
  if (attendanceData) return attendanceData;
  if (loadingPromise) return loadingPromise;
  loadingPromise = fetchAttendanceSummary().then((data) => {
    attendanceData = data;
    return data;
  });
  return loadingPromise;
};

export const getCachedAttendanceSummary = () => attendanceData;

export const clearAttendanceCache = () => {
  attendanceData = null;
  loadingPromise = null;
};
