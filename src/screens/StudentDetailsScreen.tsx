import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { getStudentsBySubjectGrade } from "../services/studentService";
import { markAttendance } from "../services/attendanceService";
import { addNotification } from "../services/notificationService";
import { getMateriaIdByMateriaGradoId } from "../services/subjectServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [justifyStudentId, setJustifyStudentId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

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
        console.error("Error fetching students or materiaId:", error);
      }
    };

    fetchData();
  }, [materiaGradoId]);

  const saveStatusToStorage = async (
    studentId: string,
    status: string,
    materiaId: string
  ) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const key = `statuses:${materiaId}:${today}`;
      const storedStatuses = await AsyncStorage.getItem(key);
      const parsedStatuses = storedStatuses ? JSON.parse(storedStatuses) : {};
      parsedStatuses[studentId] = status;
      await AsyncStorage.setItem(key, JSON.stringify(parsedStatuses));
    } catch (error) {
      console.error("Error saving status to storage:", error);
    }
  };

  const loadStatusesFromStorage = async (
    studentsList: Student[],
    materiaId: string
  ) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const key = `statuses:${materiaId}:${today}`;
      const storedStatuses = await AsyncStorage.getItem(key);
      const parsedStatuses = storedStatuses ? JSON.parse(storedStatuses) : {};

      const updatedStudents = studentsList.map((student) => ({
        ...student,
        status: parsedStatuses[student.id] || null,
      }));

      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error loading statuses from storage:", error);
    }
  };

  const handleStatusChange = async (
    studentId: string,
    estado: "presente" | "ausente" | "justificado"
  ) => {
    if (estado === "justificado") {
      setJustifyStudentId(studentId);
      setShowJustifyModal(true);
      setSelectedReason("");
      setCustomReason("");
      return;
    }

    try {
      if (!materiaId) {
        console.error(
          "materiaId no disponible. No se puede registrar la asistencia."
        );
        return;
      }

      const now = new Date();
      const fecha = now.toISOString();
      const horaRegistro = now.toTimeString().split(" ")[0];
      const registradoPor =
        (await AsyncStorage.getItem("userId")) || "desconocido";

      const attendanceData = {
        alumnoId: studentId,
        materiaId,
        fecha,
        estado,
        justificacion: estado === "justificado" ? "Falta justificada" : "",
        registradoPor,
        horaRegistro,
      };

      const response = await markAttendance(attendanceData);

      if (response.message === "Attendance recorded successfully") {
        await saveStatusToStorage(studentId, estado, materiaId);

        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId ? { ...student, status: estado } : student
          )
        );

        if (estado === "ausente") {
          const student = students.find((s) => s.id === studentId);
          if (student) {
            addNotification(
              `${student.nombre} ${student.apellido} fue marcado como ausente.`
            );
          }
        }
      } else {
        console.error("Error al registrar la asistencia:", response.message);
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  const handleSaveJustification = async () => {
    if (!justifyStudentId || !materiaId) return;
    let motivo = selectedReason === "Otro" ? customReason : selectedReason;
    if (!motivo) motivo = "Justificación no especificada";

    try {
      const now = new Date();
      const fecha = now.toISOString();
      const horaRegistro = now.toTimeString().split(" ")[0];
      const registradoPor =
        (await AsyncStorage.getItem("userId")) || "desconocido";

      const attendanceData = {
        alumnoId: justifyStudentId,
        materiaId,
        fecha,
        estado: "justificado",
        justificacion: motivo,
        registradoPor,
        horaRegistro,
      };

      const response = await markAttendance(attendanceData);

      if (response.message === "Attendance recorded successfully") {
        await saveStatusToStorage(justifyStudentId, "justificado", materiaId);

        setStudents((prev) =>
          prev.map((student) =>
            student.id === justifyStudentId
              ? { ...student, status: "justificado" }
              : student
          )
        );
      } else {
        console.error("Error al registrar la asistencia:", response.message);
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    } finally {
      setShowJustifyModal(false);
      setJustifyStudentId(null);
      setSelectedReason("");
      setCustomReason("");
    }
  };

  const imageUrls = {
    presente:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWSze6uu-FRb-KLF5upKZChsfL1Zxpiur2cw&s",
    ausente:
      "https://static.vecteezy.com/system/resources/previews/014/577/527/non_2x/red-cross-check-mark-icon-cartoon-style-vector.jpg",
    justificado:
      "https://img.freepik.com/vector-premium/icono-signo-interrogacion-estilo-dibujo-simbolo-ayuda_760231-200.jpg",
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
              <Text style={styles.studentName}>
                {item.nombre} {item.apellido}
              </Text>
              <View style={styles.optionsContainer}>
                {!item.status && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleStatusChange(item.id, "presente")}
                    >
                      <Image
                        source={{ uri: imageUrls.presente }}
                        style={styles.optionImage}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatusChange(item.id, "ausente")}
                    >
                      <Image
                        source={{ uri: imageUrls.ausente }}
                        style={styles.optionImage}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatusChange(item.id, "justificado")}
                    >
                      <Image
                        source={{ uri: imageUrls.justificado }}
                        style={styles.optionImage}
                      />
                    </TouchableOpacity>
                  </>
                )}
                {item.status && (
                  <Image
                    source={{
                      uri: imageUrls[item.status as keyof typeof imageUrls],
                    }}
                    style={[
                      styles.optionImage,
                      { borderColor: "green", borderWidth: 2, borderRadius: 5 },
                    ]}
                  />
                )}
              </View>
            </View>
          </View>
        )}
      />
      {/* Modal para justificación */}
      <Modal
        visible={showJustifyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJustifyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Selecciona un motivo de justificación
            </Text>
            <TouchableOpacity
              style={[
                styles.reasonOption,
                selectedReason === "Enfermo" && styles.selectedReasonOption,
              ]}
              onPress={() => setSelectedReason("Enfermo")}
            >
              <Text>Enfermo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.reasonOption,
                selectedReason === "Problema familiar" &&
                  styles.selectedReasonOption,
              ]}
              onPress={() => setSelectedReason("Problema familiar")}
            >
              <Text>Problema familiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.reasonOption,
                selectedReason === "Otro" && styles.selectedReasonOption,
              ]}
              onPress={() => setSelectedReason("Otro")}
            >
              <Text>Otro</Text>
            </TouchableOpacity>
            {selectedReason === "Otro" && (
              <TextInput
                style={styles.input}
                placeholder="Escribe el motivo"
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}
            <View style={styles.modalButtons}>
              {/* <Button
                title="Cancelar"
                onPress={() => setShowJustifyModal(false)}
              /> */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => setShowJustifyModal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              {/* <Button
                title="Guardar"
                onPress={handleSaveJustification}
                disabled={
                  !selectedReason ||
                  (selectedReason === "Otro" && !customReason.trim())
                }
              /> */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSaveJustification}
                disabled={
                  !selectedReason ||
                  (selectedReason === "Otro" && !customReason.trim())
                }
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    width: "48%",
    alignItems: "center",
  },
  studentContainer: {
    marginBottom: 20,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  studentName: {
    fontSize: 18,
    flex: 1,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  optionImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    width: "80%",
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  reasonOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedReasonOption: {
    backgroundColor: "#e0e0e0",
    borderColor: "#007bff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default StudentDetailsScreen;
