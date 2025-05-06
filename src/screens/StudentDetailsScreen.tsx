import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getStudentsBySubjectGrade } from '../services/studentService';
import { markAttendance } from '../services/attendanceService';
import { addNotification } from '../services/notificationService';
import { getMateriaIdByMateriaGradoId } from '../services/subjectServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Student = {
  id: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  status?: string;
};

const StudentDetailsScreen = ({ route }: any) => {
  const { materiaGradoId } = route.params;
  const [students, setStudents] = useState<Student[]>([]);
  const [materiaId, setMateriaId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentsBySubjectGrade(materiaGradoId);
        const materia = await getMateriaIdByMateriaGradoId(materiaGradoId);
        setMateriaId(materia);
        if (materia) {
          await loadStatusesFromStorage(data, materia);
        }        
      } catch (error) {
        console.error('Error fetching students or materiaId:', error);
      }
    };

    fetchData();
  }, [materiaGradoId]);

  const saveStatusToStorage = async (studentId: string, status: string, materiaId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `statuses:${materiaId}:${today}`;
      const storedStatuses = await AsyncStorage.getItem(key);
      const parsedStatuses = storedStatuses ? JSON.parse(storedStatuses) : {};
      parsedStatuses[studentId] = status;
      await AsyncStorage.setItem(key, JSON.stringify(parsedStatuses));
    } catch (error) {
      console.error('Error saving status to storage:', error);
    }
  };

  const loadStatusesFromStorage = async (studentsList: Student[], materiaId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `statuses:${materiaId}:${today}`;
      const storedStatuses = await AsyncStorage.getItem(key);
      const parsedStatuses = storedStatuses ? JSON.parse(storedStatuses) : {};

      const updatedStudents = studentsList.map((student) => ({
        ...student,
        status: parsedStatuses[student.id] || null,
      }));

      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error loading statuses from storage:', error);
    }
  };

  const handleStatusChange = async (studentId: string, estado: 'presente' | 'ausente' | 'justificado') => {
    try {
      if (!materiaId) {
        console.error('materiaId no disponible. No se puede registrar la asistencia.');
        return;
      }

      const now = new Date();
      const fecha = now.toISOString();
      const horaRegistro = now.toTimeString().split(' ')[0];
      const registradoPor = await AsyncStorage.getItem('userId') || 'desconocido';

      const attendanceData = {
        alumnoId: studentId,
        materiaId,
        fecha,
        estado,
        justificacion: estado === 'justificado' ? 'Falta justificada' : '',
        registradoPor,
        horaRegistro,
      };

      const response = await markAttendance(attendanceData);

      if (response.message === 'Attendance recorded successfully') {
        await saveStatusToStorage(studentId, estado, materiaId);

        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId ? { ...student, status: estado } : student
          )
        );

        if (estado === 'ausente') {
          const student = students.find((s) => s.id === studentId);
          if (student) {
            addNotification(`${student.nombre} ${student.apellido} fue marcado como ausente.`);
          }
        }
      } else {
        console.error('Error al registrar la asistencia:', response.message);
      }
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
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
                {!item.status && (
                  <>
                    <TouchableOpacity onPress={() => handleStatusChange(item.id, 'presente')}>
                      <Image source={{ uri: imageUrls.presente }} style={styles.optionImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStatusChange(item.id, 'ausente')}>
                      <Image source={{ uri: imageUrls.ausente }} style={styles.optionImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStatusChange(item.id, 'justificado')}>
                      <Image source={{ uri: imageUrls.justificado }} style={styles.optionImage} />
                    </TouchableOpacity>
                  </>
                )}
                {item.status && (
                  <Image
                    source={{ uri: imageUrls[item.status as keyof typeof imageUrls] }}
                    style={[styles.optionImage, { borderColor: 'green', borderWidth: 2, borderRadius: 5 }]}
                  />
                )}
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
