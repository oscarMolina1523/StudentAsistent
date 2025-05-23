import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { getAttendanceSummary } from "../services/attendanceService";
import { AttendanceSummary } from "../services/attendanceService";
import { fetchGrades, Grade } from "../services/gradeService";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { getUsersByRole } from "../services/userService";

const screenWidth = Dimensions.get("window").width;

const API_BASE_URL = "https://backend-fastapi-ten.vercel.app";

const AttendanceChart = () => {
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("todos");
  const [selectedProfessor, setSelectedProfessor] = useState<string>("todos");
  const [selectedSubject, setSelectedSubject] = useState<string>("todos");
  const [selectedTurn, setSelectedTurn] = useState<string>("todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Grados
        const gradeData = await fetchGrades();
        setGrades(gradeData);

        // Filtrar solo usuarios con rol profesor
        const profRes = await getUsersByRole("profesor");
        setProfessors(profRes.data);

        // Materias
        const subjRes = await axios.get(`${API_BASE_URL}/subjects`);
        setSubjects(subjRes.data);

        // Asistencias
        const attendanceData = await getAttendanceSummary();
        setSummary(attendanceData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  // Filtros dinámicos
  const filteredSummary = summary.filter((item) => {
    let match = true;
    if (selectedGrade !== "todos" && item.gradoId !== selectedGrade) match = false;
    if (selectedProfessor !== "todos" && item.id !== selectedProfessor) match = false;
    if (selectedSubject !== "todos" && item.materiaId !== selectedSubject) match = false;
    if (selectedTurn !== "todos") {
      const grade = grades.find((g) => g.id === item.gradoId);
      if (!grade || grade.turno !== selectedTurn) match = false;
    }
    if (selectedEstado !== "todos" && item.estado !== selectedEstado) match = false;
    return match;
  });

  // Contar estados para gráficos
  const estadoCounts = filteredSummary.reduce(
    (acc, cur) => {
      acc[cur.estado]++;
      return acc;
    },
    { presente: 0, ausente: 0, justificado: 0 }
  );

  // Tabla de inasistencias (solo ausentes si se filtra así)
  const tableData = filteredSummary
    .filter(
      (item) =>
        item.estado === "ausente" ||
        selectedEstado === "todos" ||
        selectedEstado === "ausente"
    )
    .map((item) => {
      const grade = grades.find((g) => g.id === item.gradoId);
      const subject = subjects.find((s) => s.id === item.materiaId);
      const professor = professors.find((p) => p.id === item.id);
      let nombreProfesor = "";
      if (professor) {
        nombreProfesor = professor.nombre ? professor.nombre.trim() : "";
        // Si el nombre ya viene completo, úsalo tal cual
        // Si quieres mostrar el ID, descomenta la siguiente línea:
        // nombreProfesor += ` (${professor.id})`;
      }
      return {
        alumno: item.nombreAlumno,
        grado: grade ? grade.nombre : "",
        turno: grade ? grade.turno : "",
        materia: subject ? subject.nombre : "",
        profesor: nombreProfesor,
        fecha: new Date(item.fecha).toLocaleDateString(),
      };
    });

  // Paginación
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Obtener turnos únicos de los grados
  const uniqueTurns = Array.from(new Set(grades.map((g) => g.turno)));

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGrade, selectedProfessor, selectedSubject, selectedTurn, selectedEstado]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumen de Asistencias</Text>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Profesor:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedProfessor}
              style={styles.picker}
              onValueChange={setSelectedProfessor}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Todos" value="todos" />
              {professors.map((prof) => (
                <Picker.Item
                  key={prof.id}
                  label={
                    prof.nombre
                      ? prof.nombre.trim()
                      : ""
                  }
                  value={prof.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Grado:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedGrade}
              style={styles.picker}
              onValueChange={setSelectedGrade}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Todos" value="todos" />
              {grades.map((grade) => (
                <Picker.Item key={grade.id} label={grade.nombre} value={grade.id} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Turno:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedTurn}
              style={styles.picker}
              onValueChange={setSelectedTurn}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Todos" value="todos" />
              {Array.from(new Set(grades.map((g) => g.turno))).map((turno) => (
                <Picker.Item key={turno} label={turno} value={turno} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Materia:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSubject}
              style={styles.picker}
              onValueChange={setSelectedSubject}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Todas" value="todos" />
              {subjects.map((subject) => (
                <Picker.Item key={subject.id} label={subject.nombre} value={subject.id} />
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
              onValueChange={setSelectedEstado}
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
      </View>

      {/* Gráfico de barras de asistencia general */}
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

      {/* Gráfico de torta de distribución de estados de asistencia */}
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

      {/* Tabla de detalles de inasistencias */}
      <Text style={styles.subTitle}>Detalles de Inasistencias</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.headerCell]}>Alumno</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Grado</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Turno</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Materia</Text>
        {/* <Text style={[styles.tableCell, styles.headerCell]}>Profesor</Text> */}
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
            {/* <Text style={styles.tableCell}>{row.profesor}</Text> */}
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
