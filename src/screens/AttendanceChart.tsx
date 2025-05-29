import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { getAttendanceSummary, AttendanceSummary } from "../services/attendanceService";
import { fetchGrades, Grade } from "../services/gradeService";
import { getGradeSubjectRelations, getSubjectDetails } from "../services/subjectServices";
import { getAllProfessorSubjects } from "../services/professorSubjectService";
import { getUserById } from "../services/userService";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

const FECHA_OPTIONS = [
  { label: "Hoy", value: "hoy" },
  { label: "Ayer", value: "ayer" },
  { label: "Hace 5 días", value: "5dias" },
  { label: "Hace 10 días", value: "10dias" },
  { label: "Hace 15 días", value: "15dias" },
  { label: "Hasta hoy", value: "hastaHoy" },
];

function getDateRange(option: string) {
  const today = new Date();
  let start: Date, end: Date;
  switch (option) {
    case "hoy":
      start = new Date(today);
      end = new Date(today);
      break;
    case "ayer":
      start = new Date(today);
      start.setDate(today.getDate() - 1);
      end = new Date(start);
      break;
    case "5dias":
      start = new Date(today);
      start.setDate(today.getDate() - 5);
      end = new Date(today);
      break;
    case "10dias":
      start = new Date(today);
      start.setDate(today.getDate() - 10);
      end = new Date(today);
      break;
    case "15dias":
      start = new Date(today);
      start.setDate(today.getDate() - 15);
      end = new Date(today);
      break;
    case "hastaHoy":
      start = new Date(0);
      end = new Date(today);
      break;
    default:
      start = new Date(0);
      end = new Date(today);
  }
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

const AttendanceChart = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeRelations, setGradeRelations] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [professorSubjects, setProfessorSubjects] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubjectRelationId, setSelectedSubjectRelationId] = useState<string>("");
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>("");
  const [selectedTurn, setSelectedTurn] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedFecha, setSelectedFecha] = useState<string>("hoy");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const rowsPerPage = 10;

  // Cargar grados al inicio y setear el primero por defecto
  useEffect(() => {
    fetchGrades().then((grades) => {
      setGrades(grades);
      if (grades.length > 0) setSelectedGrade(grades[0].id);
    });
    getAttendanceSummary().then(setAttendance);
  }, []);

  // Cargar relaciones grado-materia al cambiar grado y setear la primera materia por defecto
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      setSubjects([]);
      if (selectedGrade) {
        const relations = await getGradeSubjectRelations(selectedGrade);
        setGradeRelations(relations);
        // relations: [{id, materiaId, ...}]
        // Para cada materiaId, obtener el nombre real
        const subjectPromises = relations.map(async (rel: any) => {
          const subject = await getSubjectDetails(rel.materiaId);
          return {
            id: rel.materiaId,
            nombre: subject.nombre,
            materiaGradoId: rel.id,
          };
        });
        const subjectsWithNames = await Promise.all(subjectPromises);
        setSubjects(subjectsWithNames);
        if (relations.length > 0) setSelectedSubjectRelationId(relations[0].id);
        else setSelectedSubjectRelationId("");
      } else {
        setGradeRelations([]);
        setSubjects([]);
        setSelectedSubjectRelationId("");
      }
      setLoadingSubjects(false);
      setSelectedProfessorId("");
      setSelectedTurn("");
    };
    fetchSubjects();
  }, [selectedGrade]);

  // Cargar profesores relacionados a la materia-grado seleccionada y setear el primero por defecto
  useEffect(() => {
    const fetchProfessors = async () => {
      setLoadingProfessors(true);
      setProfessors([]);
      if (selectedSubjectRelationId) {
        const allProfSubjects = await getAllProfessorSubjects();
        const filteredProfSubjects = allProfSubjects.filter(
          (ps: any) => ps.materiaGradoId === selectedSubjectRelationId
        );
        setProfessorSubjects(filteredProfSubjects);

        // Obtener los datos de usuario de cada profesor (sin duplicados)
        const profs: any[] = [];
        const profIds = Array.from(new Set(filteredProfSubjects.map((ps: any) => ps.profesorId)));
        for (const profId of profIds) {
          try {
            const res = await getUserById(profId);
            if (res.success && res.data) {
              profs.push({ ...res.data });
            }
          } catch {}
        }
        setProfessors(profs);
        if (profs.length > 0) setSelectedProfessorId(profs[0].id);
        else setSelectedProfessorId("");
        // Turno por defecto
        if (filteredProfSubjects.length > 0) setSelectedTurn(filteredProfSubjects[0].turno);
        else setSelectedTurn("");
      } else {
        setProfessorSubjects([]);
        setProfessors([]);
        setSelectedProfessorId("");
        setSelectedTurn("");
      }
      setLoadingProfessors(false);
    };
    fetchProfessors();
  }, [selectedSubjectRelationId]);

  // Turnos disponibles según materia-grado seleccionada
  const filteredTurns = useMemo(() => {
    if (!selectedSubjectRelationId) return [];
    return professorSubjects.map((ps: any) => ps.turno).filter((v, i, arr) => arr.indexOf(v) === i);
  }, [professorSubjects, selectedSubjectRelationId]);

  // Filtro principal de asistencia
  const filteredAttendance = useMemo(() => {
    let filtered = attendance;
    if (selectedGrade) filtered = filtered.filter((a) => a.gradoId === selectedGrade);
    if (selectedSubjectRelationId) {
      const rel = gradeRelations.find((r) => r.id === selectedSubjectRelationId);
      if (rel) filtered = filtered.filter((a) => a.materiaId === rel.materiaId);
    }
    if (selectedProfessorId) filtered = filtered.filter((a) => a.profesorId === selectedProfessorId);
    if (selectedTurn) filtered = filtered.filter((a) => {
      const ps = professorSubjects.find((ps: any) => ps.profesorId === (selectedProfessorId || a.profesorId));
      return ps ? ps.turno === selectedTurn : true;
    });
    if (selectedEstado && selectedEstado !== "todos") filtered = filtered.filter((a) => a.estado === selectedEstado);
    if (selectedFecha) {
      const { start, end } = getDateRange(selectedFecha);
      filtered = filtered.filter((a) => {
        const fecha = new Date(a.fecha);
        return fecha >= start && fecha <= end;
      });
    }
    return filtered;
  }, [
    attendance,
    selectedGrade,
    selectedSubjectRelationId,
    selectedProfessorId,
    selectedTurn,
    selectedEstado,
    selectedFecha,
    gradeRelations,
    professorSubjects,
  ]);

  // Gráficos
  const estadoCounts = filteredAttendance.reduce(
    (acc, cur) => {
      acc[cur.estado]++;
      return acc;
    },
    { presente: 0, ausente: 0, justificado: 0 }
  );

  // Título dinámico para los gráficos
  const chartTitle = useMemo(() => {
    let parts = [];
    if (selectedGrade) {
      const g = grades.find((gr) => gr.id === selectedGrade);
      if (g) parts.push(g.nombre);
    }
    if (selectedSubjectRelationId) {
      const rel = gradeRelations.find((r) => r.id === selectedSubjectRelationId);
      if (rel) {
        const subj = subjects.find((s) => s.materiaGradoId === rel.id);
        if (subj) parts.push(`en la materia de ${subj.nombre}`);
      }
    }
    if (selectedProfessorId) {
      const p = professors.find((pr) => pr.id === selectedProfessorId);
      if (p) parts.push(`con el profesor ${p.nombre?.trim()}`);
    }
    if (selectedTurn) parts.push(`turno ${selectedTurn}`);
    if (selectedFecha) {
      const fechaLabel = FECHA_OPTIONS.find(f => f.value === selectedFecha)?.label;
      if (fechaLabel) parts.push(`(${fechaLabel})`);
    }
    return "Asistencias" + (parts.length ? " de " + parts.join(" ") : "");
  }, [selectedGrade, selectedSubjectRelationId, selectedProfessorId, selectedTurn, selectedFecha, grades, gradeRelations, professors, subjects]);

  // Tabla de detalles
  const tableData = filteredAttendance.map((item) => {
    const grade = grades.find((g) => g.id === item.gradoId);
    const rel = gradeRelations.find((r) => r.materiaId === item.materiaId);
    const subj = subjects.find((s) => s.id === item.materiaId);
    const subjectName = subj ? subj.nombre : "";
    const professor = professors.find((p) => p.id === item.profesorId);
    let nombreProfesor = professor ? professor.nombre?.trim() : "";
    return {
      alumno: item.nombreAlumno,
      grado: grade ? grade.nombre : "",
      turno: grade ? grade.turno : "",
      materia: subjectName,
      profesor: nombreProfesor,
      estado: item.estado,
      fecha: new Date(item.fecha).toLocaleDateString(),
    };
  });

  // Paginación
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGrade, selectedSubjectRelationId, selectedProfessorId, selectedTurn, selectedEstado, selectedFecha]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Grado:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedGrade}
              style={styles.picker}
              onValueChange={(v) => setSelectedGrade(v)}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              {grades.map((grade) => (
                <Picker.Item key={grade.id} label={grade.nombre} value={grade.id} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Materia:</Text>
          <View style={styles.pickerWrapper}>
            {loadingSubjects ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Picker
                selectedValue={selectedSubjectRelationId}
                style={styles.picker}
                onValueChange={(v) => setSelectedSubjectRelationId(v)}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                {subjects.map((subject) => (
                  <Picker.Item
                    key={subject.materiaGradoId}
                    label={subject.nombre}
                    value={subject.materiaGradoId}
                  />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Profesor:</Text>
          <View style={styles.pickerWrapper}>
            {loadingProfessors ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Picker
                selectedValue={selectedProfessorId}
                style={styles.picker}
                onValueChange={(v) => setSelectedProfessorId(v)}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                {professors.map((prof) => (
                  <Picker.Item
                    key={prof.id}
                    label={prof.nombre ? prof.nombre.trim() : ""}
                    value={prof.id}
                  />
                ))}
              </Picker>
            )}
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Turno:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedTurn}
              style={styles.picker}
              onValueChange={(v) => setSelectedTurn(v)}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              {filteredTurns.map((turno) => (
                <Picker.Item key={turno} label={turno} value={turno} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Estado:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedEstado}
              style={styles.picker}
              onValueChange={(v) => setSelectedEstado(v)}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Todos" value="todos" />
              <Picker.Item label="Presente" value="presente" />
              <Picker.Item label="Ausente" value="ausente" />
              <Picker.Item label="Justificado" value="justificado" />
            </Picker>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Fecha:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedFecha}
              style={styles.picker}
              onValueChange={setSelectedFecha}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              {FECHA_OPTIONS.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      <Text style={styles.title}>{chartTitle}</Text>

      {/* Gráfico de barras */}
      <Text style={styles.graphTitle}>Distribución de Asistencias</Text>
      <BarChart
        data={{
          labels: ["Presente", "Ausente", "Justificado"],
          datasets: [
            {
              data: [
                estadoCounts.presente,
                estadoCounts.ausente,
                estadoCounts.justificado,
              ],
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f0f0f0",
          backgroundGradientTo: "#e0e0e0",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
      />

      {/* Gráfico de torta */}
      <Text style={styles.graphTitle}>Porcentaje de Estados</Text>
      <PieChart
        data={[
          {
            name: "Presente",
            population: estadoCounts.presente,
            color: "green",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Ausente",
            population: estadoCounts.ausente,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "Justificado",
            population: estadoCounts.justificado,
            color: "yellow",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
        ]}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f0f0f0",
          backgroundGradientTo: "#e0e0e0",
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      {/* Tabla de detalles */}
      <Text style={styles.subTitle}>Detalles de Asistencias</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.headerCell]}>Alumno</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Grado</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Turno</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Materia</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Profesor</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Estado</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Fecha</Text>
      </View>
      {paginatedData.length === 0 ? (
        <Text style={styles.noDataText}>No hay registros para los filtros seleccionados.</Text>
      ) : (
        paginatedData.map((row, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.tableCell}>{row.alumno}</Text>
            <Text style={styles.tableCell}>{row.grado}</Text>
            <Text style={styles.tableCell}>{row.turno}</Text>
            <Text style={styles.tableCell}>{row.materia}</Text>
            <Text style={styles.tableCell}>{row.profesor}</Text>
            <Text style={styles.tableCell}>{row.estado}</Text>
            <Text style={styles.tableCell}>{row.fecha}</Text>
          </View>
        ))
      )}
      {/* Paginación */}
      {tableData.length > rowsPerPage && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>
            Página {currentPage} de {totalPages}
          </Text>
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
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
            >
              Siguiente
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 10,
    marginBottom: 0,
    minHeight: 54,
    height: 54,
  },
  picker: {
    width: "100%",
    height: 54,
    color: "#222",
    fontSize: 18,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItem: {
    fontSize: 18,
    height: 54,
    textAlign: "center",
    textAlignVertical: "center",
  },
  filtersContainer: {
    width: "100%",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  filterLabel: {
    width: 80,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 13,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  paginationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  paginationButtons: {
    flexDirection: "row",
    gap: 20,
  },
  paginationButton: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  paginationButtonDisabled: {
    color: "#ccc",
  },
});

export default AttendanceChart;