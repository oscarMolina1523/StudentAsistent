import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAttendanceReport } from "../contexts/AttendanceReportContext";
import {getSubjectDetails} from "../services/subjectServices";

interface ReportData {
  total: number;
  masculino: { presente: number; ausente: number; justificado: number };
  femenino: { presente: number; ausente: number; justificado: number };
  totalPresente: number;
  totalAusente: number;
  totalJustificado: number;
}

const ReportScreen = () => {
  const { reports } = useAttendanceReport();
  const [selected, setSelected] = useState<{ materiaId: string; fecha: string } | null>(null);
  const [materiaNombres, setMateriaNombres] = useState<{ [materiaId: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Unificar materias y fechas
  type FlatReport = {
    materiaId: string;
    fecha: string;
    report: ReportData;
  };
  const flatReports: FlatReport[] = [];
  for (const materiaId of Object.keys(reports)) {
    for (const fecha of Object.keys(reports[materiaId] || {})) {
      const report = reports[materiaId][fecha];
      // Validar que el reporte tenga la estructura correcta
      if (
        report &&
        typeof report.total === 'number' &&
        report.masculino && typeof report.masculino.presente === 'number' &&
        report.femenino && typeof report.femenino.presente === 'number'
      ) {
        flatReports.push({ materiaId, fecha, report });
      }
    }
  }

  // Cargar nombres de materia para la lista y detalle usando getSubjectDetails
  useEffect(() => {
    const fetchNombres = async () => {
      const nombres: { [materiaId: string]: string } = {};
      for (const rep of flatReports) {
        if (!nombres[rep.materiaId]) {
          try {
            const subject = await getSubjectDetails(rep.materiaId);
            if (subject?.nombre) {
              nombres[rep.materiaId] = subject.nombre;
            }
          } catch (e) {
            // Si da error (404), no agregamos el materiaId a nombres
            // Opcional: puedes poner el materiaId como fallback
            nombres[rep.materiaId] = rep.materiaId;
          }
        }
      }
      setMateriaNombres(nombres);
      setLoading(false);
    };
    setLoading(true);
    if (flatReports.length > 0) fetchNombres();
    else setLoading(false);
  }, [reports]);

  // Mostrar detalle de reporte seleccionado
  if (selected) {
    const found = flatReports.find(
      (r) => r.materiaId === selected.materiaId && r.fecha === selected.fecha
    );
    if (found) {
      const materiaNombre = materiaNombres[found.materiaId] || found.materiaId;
      const report = found.report;
      // Validar que el reporte tenga la estructura correcta antes de mostrar
      if (!report || !report.masculino || !report.femenino) {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Reporte inválido o incompleto.</Text>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ marginTop: 20 }}>
              <Text style={{ color: '#007bff', fontWeight: 'bold' }}>{'< Volver a la lista de reportes'}</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => setSelected(null)} style={{ marginBottom: 16 }}>
            <Text style={{ color: '#007bff', fontWeight: 'bold' }}>{'< Volver a la lista de reportes'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reporte de Asistencia</Text>
          <Text style={styles.sectionTitle}>Materia: {materiaNombre}</Text>
          <Text style={styles.sectionTitle}>Fecha: {found.fecha}</Text>
          <Text style={styles.sectionTitle}>Totales Generales</Text>
          <Text style={styles.text}>Total de alumnos: {report.total ?? 0}</Text>
          <Text style={styles.text}>Presentes: {report.totalPresente ?? 0}</Text>
          <Text style={styles.text}>Ausentes: {report.totalAusente ?? 0}</Text>
          <Text style={styles.text}>Justificados: {report.totalJustificado ?? 0}</Text>
          <Text style={styles.sectionTitle}>Por Género</Text>
          <Text style={styles.subTitle}>Masculino</Text>
          <Text style={styles.text}>Presentes: {report.masculino.presente ?? 0}</Text>
          <Text style={styles.text}>Ausentes: {report.masculino.ausente ?? 0}</Text>
          <Text style={styles.text}>Justificados: {report.masculino.justificado ?? 0}</Text>
          <Text style={styles.subTitle}>Femenino</Text>
          <Text style={styles.text}>Presentes: {report.femenino.presente ?? 0}</Text>
          <Text style={styles.text}>Ausentes: {report.femenino.ausente ?? 0}</Text>
          <Text style={styles.text}>Justificados: {report.femenino.justificado ?? 0}</Text>
        </ScrollView>
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando reportes...</Text>
      </View>
    );
  }

  if (flatReports.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay reportes de asistencia en esta sesión.</Text>
      </View>
    );
  }

  // Mostrar lista de todos los reportes (agrupados por materia y fecha)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reportes de Asistencia</Text>
      {flatReports.map((rep, idx) => (
        <TouchableOpacity
          key={rep.materiaId + rep.fecha + idx}
          style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', width: '100%' }}
          onPress={() => setSelected({ materiaId: rep.materiaId, fecha: rep.fecha })}
        >
          <Text style={styles.sectionTitle}>
            Materia: {materiaNombres[rep.materiaId] || rep.materiaId}
          </Text>
          <Text style={{ fontWeight: 'bold' }}>Fecha: {rep.fecha}</Text>
          <Text style={styles.text}>Total: {rep.report.total ?? 0}</Text>
          <Text style={styles.text}>Presentes: {rep.report.totalPresente ?? 0}</Text>
          <Text style={styles.text}>Ausentes: {rep.report.totalAusente ?? 0}</Text>
          <Text style={styles.text}>Justificados: {rep.report.totalJustificado ?? 0}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    marginBottom: 2,
  },
});

export default ReportScreen;
