import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getStudentsByGrade } from '../services/studentService';
import { markAttendance } from '../services/attendanceService';
import { addNotification } from '../services/notificationService';

type Student = { id: number; name: string; status?: string };

const StudentDetailsScreen = ({ route }: { route: { params: { gradeId: number } } }) => {
  const { gradeId } = route.params;

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const studentsData = getStudentsByGrade(gradeId);
    setStudents(studentsData);
  }, [gradeId]);

  const handleStatusChange = async (studentId: number, status: string) => {
    await markAttendance(studentId, status);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
    if (status === 'Ausente') {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        addNotification(`${student.name} fue marcado como ausente.`);
      }
    }
  };

  const imageUrls = {
    presente: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWSze6uu-FRb-KLF5upKZChsfL1Zxpiur2cw&s',
    ausente: 'https://static.vecteezy.com/system/resources/previews/014/577/527/non_2x/red-cross-check-mark-icon-cartoon-style-vector.jpg',
    justificado: 'https://img.freepik.com/vector-premium/icono-signo-interrogacion-estilo-dibujo-simbolo-ayuda_760231-200.jpg',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estudiantes del {gradeId} Grado</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.studentContainer}>
            <View style={styles.studentRow}>
              <Text style={styles.studentName}>{item.name}</Text>
              <View style={styles.optionsContainer}>
                {!item.status || item.status === 'Presente' ? (
                  <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Presente')}>
                    <Image
                      source={{ uri: imageUrls.presente }}
                      style={styles.optionImage}
                    />
                  </TouchableOpacity>
                ) : null}
                {!item.status || item.status === 'Ausente' ? (
                  <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Ausente')}>
                    <Image
                      source={{ uri: imageUrls.ausente }}
                      style={styles.optionImage}
                    />
                  </TouchableOpacity>
                ) : null}
                {!item.status || item.status === 'Justificado' ? (
                  <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Justificado')}>
                    <Image
                      source={{ uri: imageUrls.justificado }}
                      style={styles.optionImage}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  studentContainer: {
    marginBottom: 20,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    fontSize: 18,
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

export default StudentDetailsScreen;
