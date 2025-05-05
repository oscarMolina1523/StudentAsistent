import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/studentService'; // Asegúrate de que la ruta sea correcta

// Definir la interfaz para el estudiante
interface Student {
  id: string;
  nombre: string;
  apellido: string;
  gradoId: string;
  turno: string;
  fechaNacimiento: string;
  activo: boolean;
}

const StudentManagementScreen = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentData, setStudentData] = useState<Student>({
    id: '',
    nombre: '',
    apellido: '',
    gradoId: '',
    turno: '',
    fechaNacimiento: '',
    activo: true,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await getAllStudents();
    if (response.success) {
      setStudents(response.data);
    } else {
      alert(response.message);
    }
  };

  const handleCreate = async () => {
    const response = await createStudent(studentData);
    if (response.success) {
      fetchStudents();
      setModalVisible(false);
    } else {
      alert(response.message);
    }
  };

  const handleUpdate = async () => {
    if (selectedStudent && selectedStudent.id) {
      const response = await updateStudent(selectedStudent.id, studentData);
      if (response.success) {
        fetchStudents();
        setModalVisible(false);
      } else {
        alert(response.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deleteStudent(id);
    if (response.success) {
      fetchStudents();
    } else {
      alert(response.message);
    }
  };

  const openModal = (student: Student | null) => {
    if (student) {
      setSelectedStudent(student);
      setStudentData(student);
    } else {
      setSelectedStudent(null);
      setStudentData({
        id: '',
        nombre: '',
        apellido: '',
        gradoId: '',
        turno: '',
        fechaNacimiento: '',
        activo: true,
      });
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button title="Agregar Estudiante" onPress={() => openModal(null)} />
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text>{`${item.nombre} ${item.apellido}`}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Ionicons name="create" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={studentData.nombre}
              onChangeText={(text) => setStudentData({ ...studentData, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={studentData.apellido}
              onChangeText={(text) => setStudentData({ ...studentData, apellido: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Grado ID"
              value={studentData.gradoId}
              onChangeText={(text) => setStudentData({ ...studentData, gradoId: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Turno"
              value={studentData.turno}
              onChangeText={(text) => setStudentData({ ...studentData, turno: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de Nacimiento"
              value={studentData.fechaNacimiento}
              onChangeText={(text) => setStudentData({ ...studentData, fechaNacimiento: text })}
            />
            <Button title={selectedStudent ? 'Actualizar' : 'Crear'} onPress={selectedStudent ? handleUpdate : handleCreate} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default StudentManagementScreen;
