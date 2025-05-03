export const markAttendance = async (studentId: string, status: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `Attendance marked as ${status} for student ${studentId}` });
    }, 500);
  });
};
