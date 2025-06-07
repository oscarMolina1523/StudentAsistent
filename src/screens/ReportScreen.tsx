import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { getAllReportsFromSession } from "./StudentDetailsScreen";
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
  const [reports, setReports] = useState<any>({});
  const [selected, setSelected] = useState<{ materiaId: string; fecha: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [materiaNombres, setMateriaNombres] = useState<{ [materiaId: string]: string }>({});

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const all = await getAllReportsFromSession();
      setReports(all);
      setLoading(false);
    };
    fetchReports();
  }, []);

  // Cargar nombres de materia para la lista y detalle usando getSubjectDetails
  useEffect(() => {
    const fetchNombres = async () => {
      const nombres: { [materiaId: string]: string } = {};
      const validReports: any = {};
      for (const materiaId of Object.keys(reports)) {
        try {
          const subject = await getSubjectDetails(materiaId);
          if (subject?.nombre) {
            nombres[materiaId] = subject.nombre;
            validReports[materiaId] = reports[materiaId];
          }
        } catch {
          // Si da error (404), no agregamos el materiaId a nombres ni a validReports
        }
      }
      setMateriaNombres(nombres);
      setReports(validReports); // Limpia los reportes inválidos
    };
    if (Object.keys(reports).length > 0) fetchNombres();
  }, [reports]);

  // Si hay un reporte seleccionado, mostrarlo
  let materiaNombre = selected?.materiaId;
  if (selected && materiaNombres[selected.materiaId]) {
    materiaNombre = materiaNombres[selected.materiaId];
  }
  if (selected && reports[selected.materiaId] && reports[selected.materiaId][selected.fecha]) {
    const report = reports[selected.materiaId][selected.fecha];
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setSelected(null)} style={{ marginBottom: 16 }}>
          <Text style={{ color: '#007bff', fontWeight: 'bold' }}>{'< Volver a la lista de reportes'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reporte de Asistencia</Text>
        <Text style={styles.sectionTitle}>Materia: {materiaNombre}</Text>
        <Text style={styles.sectionTitle}>Fecha: {selected.fecha}</Text>
        <Text style={styles.sectionTitle}>Totales Generales</Text>
        <Text style={styles.text}>Total de alumnos: {report.total}</Text>
        <Text style={styles.text}>Presentes: {report.totalPresente}</Text>
        <Text style={styles.text}>Ausentes: {report.totalAusente}</Text>
        <Text style={styles.text}>Justificados: {report.totalJustificado}</Text>
        <Text style={styles.sectionTitle}>Por Género</Text>
        <Text style={styles.subTitle}>Masculino</Text>
        <Text style={styles.text}>Presentes: {report.masculino.presente}</Text>
        <Text style={styles.text}>Ausentes: {report.masculino.ausente}</Text>
        <Text style={styles.text}>Justificados: {report.masculino.justificado}</Text>
        <Text style={styles.subTitle}>Femenino</Text>
        <Text style={styles.text}>Presentes: {report.femenino.presente}</Text>
        <Text style={styles.text}>Ausentes: {report.femenino.ausente}</Text>
        <Text style={styles.text}>Justificados: {report.femenino.justificado}</Text>
      </ScrollView>
    );
  }

  // Mostrar lista de reportes
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando reportes...</Text>
      </View>
    );
  }

  const materiaIds = Object.keys(reports);
  if (materiaIds.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay reportes de asistencia en esta sesión.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reportes de Asistencia</Text>
      {materiaIds.map((materiaId) => (
        <View key={materiaId} style={{ width: '100%' }}>
          <Text style={styles.sectionTitle}>
            Materia: {typeof materiaNombres[materiaId] === 'string' ? materiaNombres[materiaId] : materiaId}
          </Text>
          {Object.keys(reports[materiaId]).map((fecha) => (
            <TouchableOpacity
              key={fecha}
              style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' }}
              onPress={() => setSelected({ materiaId, fecha })}
            >
              <Text style={{ fontWeight: 'bold' }}>Fecha: {fecha}</Text>
              <Text style={styles.text}>Total: {reports[materiaId][fecha].total}</Text>
              <Text style={styles.text}>Presentes: {reports[materiaId][fecha].totalPresente}</Text>
              <Text style={styles.text}>Ausentes: {reports[materiaId][fecha].totalAusente}</Text>
              <Text style={styles.text}>Justificados: {reports[materiaId][fecha].totalJustificado}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
