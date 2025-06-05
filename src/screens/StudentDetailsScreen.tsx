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
  Alert,
  ActivityIndicator,
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
  // Estado para las asistencias seleccionadas antes de guardar
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, "presente" | "ausente" | "justificado" | null>>({});
  // Nuevo estado para controlar si la asistencia de hoy ya fue tomada
  const [attendanceTakenToday, setAttendanceTakenToday] = useState(false);
  const [loading, setLoading] = useState(true);
  // Estado para motivos de justificación por estudiante
  const [justificationReasons, setJustificationReasons] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getStudentsBySubjectGrade(materiaGradoId);
        const materia = await getMateriaIdByMateriaGradoId(materiaGradoId);
        setMateriaId(materia);
        let allHaveStatus = true;
        let parsedStatuses: Record<string, string> = {};
        if (materia) {
          // Cargar status de storage para hoy
          const today = new Date().toISOString().split("T")[0];
          const key = `statuses:${materia}:${today}`;
          const storedStatuses = await AsyncStorage.getItem(key);
          parsedStatuses = storedStatuses ? JSON.parse(storedStatuses) : {};
          // Actualizar students con status real de storage
          const updatedStudents = data.map((student: Student) => ({
            ...student,
            status: parsedStatuses[student.id] || null,
          }));
          setStudents(updatedStudents);
          // Verificar si todos tienen status
          for (const student of updatedStudents) {
            if (!student.status) {
              allHaveStatus = false;
              break;
            }
          }
        } else {
          setStudents(data);
          allHaveStatus = false;
        }
        // Draft solo si no se ha tomado asistencia
        if (!allHaveStatus) {
          const draft: Record<string, "presente" | "ausente" | "justificado" | null> = {};
          data.forEach((student: any) => {
            const val = parsedStatuses[student.id];
            draft[student.id] = val === "presente" || val === "ausente" || val === "justificado" ? val : null;
          });
          setAttendanceDraft(draft);
        } else {
          setAttendanceDraft({});
        }
        setAttendanceTakenToday(allHaveStatus);
      } catch (error) {
        console.error("Error fetching students or materiaId:", error);
      } finally {
        setLoading(false);
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
        estado: estado as "presente" | "ausente" | "justificado",
        justificacion: estado === "justificado" ? "Falta justificada" : undefined,
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

  // Cambiar selección de asistencia en el draft
  const handleDraftChange = (studentId: string, estado: "presente" | "ausente" | "justificado") => {
    if (estado === "justificado") {
      setJustifyStudentId(studentId);
      setShowJustifyModal(true);
      setSelectedReason(justificationReasons[studentId] || "");
      setCustomReason("");
    } else {
      setAttendanceDraft((prev) => ({ ...prev, [studentId]: prev[studentId] === estado ? null : estado }));
      // Si cambia a otro estado, limpiar motivo
      setJustificationReasons((prev) => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
    }
  };

  // Guardar motivo de justificación en el draft
  const handleSaveJustification = () => {
    if (!justifyStudentId) return;
    let motivo = selectedReason === "Otro" ? customReason : selectedReason;
    if (!motivo) motivo = "Justificación no especificada";
    setAttendanceDraft((prev) => ({ ...prev, [justifyStudentId!]: "justificado" }));
    setJustificationReasons((prev) => ({ ...prev, [justifyStudentId!]: motivo }));
    setShowJustifyModal(false);
    setJustifyStudentId(null);
    setSelectedReason("");
    setCustomReason("");
  };

  // Guardar todas las asistencias seleccionadas
  const handleSaveAllAttendance = async () => {
    if (!materiaId) return;
    const toSend = Object.entries(attendanceDraft).filter(([_id, estado]) => estado === "presente" || estado === "ausente" || estado === "justificado");
    if (toSend.length === 0) {
      Alert.alert("Atención", "Selecciona al menos una asistencia antes de guardar.");
      return;
    }
    try {
      setSaving(true);
      const now = new Date();
      const fecha = now.toISOString();
      const horaRegistro = now.toTimeString().split(" ")[0];
      const registradoPor = (await AsyncStorage.getItem("userId")) || "desconocido";
      for (const [studentId, estado] of toSend) {
        const typedEstado = estado as "presente" | "ausente" | "justificado";
        const attendanceData = {
          alumnoId: studentId,
          materiaId,
          fecha,
          estado: typedEstado,
          justificacion: typedEstado === "justificado" ? (justificationReasons[studentId] || "Justificación no especificada") : undefined,
          registradoPor,
          horaRegistro,
        };
        await markAttendance(attendanceData);
        await saveStatusToStorage(studentId, typedEstado, materiaId);
      }
      setStudents((prev) => prev.map((student) => ({ ...student, status: attendanceDraft[student.id] || undefined })));
      setAttendanceTakenToday(true); // Bloquear toma de asistencia inmediatamente
      Alert.alert("Éxito", "Asistencia tomada con éxito");
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al guardar la asistencia");
      console.error(error);
    } finally {
      setSaving(false);
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
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Cargando estudiantes...</Text>
        </View>
      ) : (
        <>
          {attendanceTakenToday && (
            <View style={{ marginBottom: 16, backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8 }}>
              <Text style={{ color: '#888', textAlign: 'center', fontWeight: 'bold' }}>
                La asistencia de hoy ya fue tomada. Podrás registrar de nuevo mañana.
              </Text>
            </View>
          )}
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
                    {!attendanceTakenToday && (["presente", "ausente", "justificado"].map((estado) => (
                      <TouchableOpacity
                        key={estado}
                        style={{
                          marginLeft: 10,
                          borderWidth: 2,
                          borderColor: attendanceDraft[item.id] === estado ? "#339999" : "#ccc",
                          borderRadius: 5,
                          padding: 2,
                          backgroundColor: attendanceDraft[item.id] === estado ? "#e0f7fa" : "#fff",
                        }}
                        onPress={() => handleDraftChange(item.id, estado as any)}
                      >
                        <Image
                          source={{ uri: imageUrls[estado as keyof typeof imageUrls] }}
                          style={styles.optionImage}
                        />
                        <Text style={{ fontSize: 10, textAlign: "center" }}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Text>
                      </TouchableOpacity>
                    )))}
                    {attendanceTakenToday && item.status && (
                      <Image
                        source={{ uri: imageUrls[item.status as keyof typeof imageUrls] }}
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
          {/* Botón para guardar asistencia al final */}
          {!attendanceTakenToday && (
            <TouchableOpacity
              style={[
                styles.button,
                { alignSelf: "center", width: 220, marginTop: 10 },
              ]}
              onPress={handleSaveAllAttendance}
            >
              <Text style={styles.buttonText}>Guardar asistencia</Text>
            </TouchableOpacity>
          )}
          {attendanceTakenToday && (
            <View style={{ marginTop: 16, backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8 }}>
              <Text style={{ color: '#888', textAlign: 'center', fontWeight: 'bold' }}>
                La asistencia de hoy ya fue tomada. Podrás registrar de nuevo mañana.
              </Text>
            </View>
          )}
        </>
      )}
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
                selectedReason === "Problema familiar" && styles.selectedReasonOption,
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
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => setShowJustifyModal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
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
      {saving && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}>
          <View style={{ backgroundColor: "#fff", padding: 30, borderRadius: 16, alignItems: "center" }}>
            <Text style={{ marginBottom: 10, fontSize: 16, color: "#339999", fontWeight: "bold" }}>Registrando asistencia...</Text>
            <ActivityIndicator size="large" color="#339999" />
          </View>
        </View>
      )}
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
