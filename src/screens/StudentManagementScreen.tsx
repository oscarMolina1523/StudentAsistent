import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getPaginatedStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";
import { fetchGrades } from "../services/gradeService";
import { Picker } from "@react-native-picker/picker";
import { Grade, Student } from "../models/Models";

const PAGE_SIZE = 10;

const StudentManagementScreen = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [studentData, setStudentData] = useState<Student>({
    id: "",
    nombre: "",
    apellido: "",
    gender: "",
    gradoId: "",
    turno: "",
    fechaNacimiento: "",
    activo: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPaginatedStudents(currentPage);
    fetchGradesList();
  }, [currentPage]);

  const fetchPaginatedStudents = async (page: number) => {
    const response = await getPaginatedStudents(page, PAGE_SIZE);
    if (response.success) {
      const dataArr = response.data.results || response.data.students || [];
      setStudents(dataArr);
      setHasMore(dataArr.length === PAGE_SIZE);
    } else {
      alert(response.message);
    }
  };

  const fetchGradesList = async () => {
    try {
      const result = await fetchGrades();
      // Ordenamos de menor a mayor (1ro, 2do, ..., 6to)
      const ordered = result.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setGrades(ordered);
    } catch (error) {
      alert("Error al obtener grados");
    }
  };

  const handleCreate = async () => {
    const response = await createStudent(studentData);
    if (response.success) {
      fetchPaginatedStudents(currentPage);
      setModalVisible(false);
    } else {
      alert(response.message);
    }
  };

  const handleUpdate = async () => {
    if (selectedStudent && selectedStudent.id) {
      const response = await updateStudent(selectedStudent.id, studentData);
      if (response.success) {
        fetchPaginatedStudents(currentPage);
        setModalVisible(false);
      } else {
        alert(response.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deleteStudent(id);
    if (response.success) {
      fetchPaginatedStudents(currentPage);
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
        id: "",
        nombre: "",
        apellido: "",
        gender: "",
        gradoId: grades.length > 0 ? grades[0].id : "",
        turno: "",
        fechaNacimiento: "",
        activo: true,
      });
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => openModal(null)}>
        <Text style={styles.buttonText}>Agregar Estudiante</Text>
      </TouchableOpacity>
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
      {/* Paginación */}
      <View style={styles.paginationContainer}>
        <View style={styles.paginationButtons}>
          <Text
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationButtonDisabled,
            ]}
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Text>
          <Text
            style={[
              styles.paginationButton,
              !hasMore && styles.paginationButtonDisabled,
            ]}
            onPress={() => hasMore && setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </Text>
        </View>
        <Text style={styles.paginationText}>
          Página {currentPage}
        </Text>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={studentData.nombre}
              onChangeText={(text) =>
                setStudentData({ ...studentData, nombre: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={studentData.apellido}
              onChangeText={(text) =>
                setStudentData({ ...studentData, apellido: text })
              }
            />
            <Picker
              selectedValue={studentData.gender || ""}
              onValueChange={(itemValue) =>
                setStudentData({ ...studentData, gender: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Selecciona género" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
            </Picker>

            {/* Picker para gradoId */}
            <Picker
              selectedValue={studentData.gradoId}
              onValueChange={(itemValue) =>
                setStudentData({ ...studentData, gradoId: itemValue })
              }
              style={styles.picker}
            >
              {grades.map((grade) => (
                <Picker.Item
                  key={grade.id}
                  label={`${grade.nombre} (${grade.turno})`}
                  value={grade.id}
                />
              ))}
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Turno"
              value={studentData.turno}
              onChangeText={(text) =>
                setStudentData({ ...studentData, turno: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de Nacimiento"
              value={studentData.fechaNacimiento}
              onChangeText={(text) =>
                setStudentData({ ...studentData, fechaNacimiento: text })
              }
            />
            <TouchableOpacity
              style={styles.button}
              onPress={selectedStudent ? handleUpdate : handleCreate}
            >
              <Text style={styles.buttonText}>
                {selectedStudent ? "Actualizar" : "Crear"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#339999",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
  },
  paginationContainer: { alignItems: "center", marginVertical: 40 },
  paginationText: { fontSize: 14, marginBottom: 4 },
  paginationButtons: { flexDirection: "row", gap: 20 },
  paginationButton: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  paginationButtonDisabled: { color: "#ccc" },
});

export default StudentManagementScreen;
