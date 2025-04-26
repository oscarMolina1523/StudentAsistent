export const markAttendance = async (studentId: number, status: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `Attendance marked as ${status} for student ${studentId}` });
    }, 500);
  });
};
