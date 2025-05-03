import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getStudentsBySubjectGrade } from '../services/studentService';
import { markAttendance } from '../services/attendanceService';
import { addNotification } from '../services/notificationService';

type Student = {
  id: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  status?: string;
};

const StudentDetailsScreen = ({ route, navigation }: any) => {
  const { materiaGradoId } = route.params;
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsBySubjectGrade(materiaGradoId);
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [materiaGradoId]);

  const handleStatusChange = async (studentId: string, status: string) => {
    await markAttendance(studentId, status);
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
    if (status === 'Ausente') {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        addNotification(`${student.nombre} ${student.apellido} fue marcado como ausente.`);
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
      <Text style={styles.title}>Estudiantes de la Materia</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentContainer}>
            <View style={styles.studentRow}>
              <Text style={styles.studentName}>{item.nombre} {item.apellido}</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Presente')}>
                  <Image source={{ uri: imageUrls.presente }} style={styles.optionImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Ausente')}>
                  <Image source={{ uri: imageUrls.ausente }} style={styles.optionImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusChange(item.id, 'Justificado')}>
                  <Image source={{ uri: imageUrls.justificado }} style={styles.optionImage} />
                </TouchableOpacity>
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
