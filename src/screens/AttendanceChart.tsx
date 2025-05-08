import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getAttendanceSummary } from '../services/attendanceService';
import { AttendanceSummary } from '../services/attendanceService';
import { fetchGrades, Grade } from '../services/gradeService'; // Agrega el import para obtener los grados
import { Picker } from '@react-native-picker/picker'; // Para seleccionar el grado

const screenWidth = Dimensions.get('window').width;

const AttendanceChart = () => {
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [counts, setCounts] = useState({ presente: 0, ausente: 0, justificado: 0 });
  const [topAbsentStudents, setTopAbsentStudents] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('todos');
  const [grades, setGrades] = useState<Grade[]>([]); // Estado para los grados

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener grados desde la API
        const gradeData = await fetchGrades();
        const sortedGrades = gradeData.sort((a, b) => {
          const numA = parseInt(a.nombre.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.nombre.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
        setGrades(sortedGrades);
        

        // Obtener los datos de asistencia
        const attendanceData = await getAttendanceSummary();
        setSummary(attendanceData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  // Función para filtrar los datos por grado
  const filteredSummary = selectedGrade === 'todos'
    ? summary
    : summary.filter(item => item.gradoId === selectedGrade);

  // Si no hay datos de asistencia para el grado seleccionado, mostrar todos los alumnos como presentes
  const estadoCounts = filteredSummary.length === 0
    ? { presente: 1, ausente: 0, justificado: 0 }  // Si no hay datos, todos están presentes
    : filteredSummary.reduce(
        (acc, cur) => {
          acc[cur.estado]++;
          return acc;
        },
        { presente: 0, ausente: 0, justificado: 0 }
      );

  const absentCounts: { [key: string]: number } = {};
  filteredSummary.forEach((item) => {
    if (item.estado === 'ausente') {
      absentCounts[item.nombreAlumno] = (absentCounts[item.nombreAlumno] || 0) + 1;
    }
  });

  // Si no hay inasistencias, mostrar que todos los alumnos han asistido
  const sortedAbsentStudents = filteredSummary.length === 0 || Object.keys(absentCounts).length === 0
    ? []  // Si no hay inasistencias, no hay top 5
    : Object.entries(absentCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumen de Asistencias</Text>

      {/* Picker para seleccionar el grado */}
      <Picker
        selectedValue={selectedGrade}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedGrade(itemValue)}
      >
        <Picker.Item label="Todos los grados" value="todos" />
        {grades.map((grade) => (
          <Picker.Item key={grade.id} label={grade.nombre} value={grade.id} />
        ))}
      </Picker>

      {/* Gráfico de barras de asistencia general */}
      <BarChart
        data={{
          labels: ['Presente', 'Ausente', 'Justificado'],
          datasets: [
            {
              data: [estadoCounts.presente, estadoCounts.ausente, estadoCounts.justificado],
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f0f0f0',
          backgroundGradientTo: '#e0e0e0',
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
            name: 'Presente',
            population: estadoCounts.presente,
            color: 'green',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Ausente',
            population: estadoCounts.ausente,
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Justificado',
            population: estadoCounts.justificado,
            color: 'yellow',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f0f0f0',
          backgroundGradientTo: '#e0e0e0',
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      {/* Gráfico de barras de los 5 alumnos con más inasistencias */}
      {sortedAbsentStudents.length > 0 && (
        <>
          <Text style={styles.subTitle}>Top 5 Alumnos con más Inasistencias</Text>
          <BarChart
            data={{
              labels: sortedAbsentStudents.map((item) =>
                item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name
              ),
              datasets: [
                {
                  data: sortedAbsentStudents.map((item) => item.count),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f0f0f0',
              backgroundGradientTo: '#e0e0e0',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </>
      )}

      {/* Mensaje si no hay inasistencias */}
      {sortedAbsentStudents.length === 0 && selectedGrade !== 'todos' && (
        <Text style={styles.noDataText}>Todos los alumnos han asistido este mes.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: screenWidth - 40,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default AttendanceChart;
