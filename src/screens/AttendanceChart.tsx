import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getAttendanceSummary } from '../services/attendanceService';
import { AttendanceSummary } from '../services/attendanceService';

const screenWidth = Dimensions.get('window').width;

const AttendanceChart = () => {
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [counts, setCounts] = useState({ presente: 0, ausente: 0, justificado: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttendanceSummary();
        setSummary(data);

        const estadoCounts = data.reduce(
          (acc, cur) => {
            acc[cur.estado]++;
            return acc;
          },
          { presente: 0, ausente: 0, justificado: 0 }
        );

        setCounts(estadoCounts);
      } catch (error) {
        console.error('Error loading summary:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Asistencias</Text>
      <BarChart
        data={{
          labels: ['Presente', 'Ausente', 'Justificado'],
          datasets: [
            {
              data: [counts.presente, counts.ausente, counts.justificado],
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix="" // 🔥 SOLUCIÓN AL ERROR
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
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
});

export default AttendanceChart;