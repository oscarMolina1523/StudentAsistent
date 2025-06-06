import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserById } from "../services/userService";
import { getStudentById } from "../services/studentService";

export const TutorStudentRelationsList = ({ relations, onEdit }) => {
  const [tutors, setTutors] = useState<Record<string, string>>({});
  const [alumns, setAlumns] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTutorAndAlumns = async () => {
      const tutorResult: Record<string, string> = {};
      const alumnsResult: Record<string, string> = {};
      for (const rel of relations) {
        if (!tutorResult[rel.tutorId]) {
          const res = await getUserById(rel.tutorId);
          if (res.success) {
            tutorResult[rel.tutorId] = res.data.nombre;
          } else {
            tutorResult[rel.tutorId] = "Desconocido";
          }
        }
        if (!alumnsResult[rel.alumnoId]) {
          try {
            const alumn = await getStudentById(rel.alumnoId);
            alumnsResult[rel.alumnoId] =
              alumn && alumn.success && alumn.data
                ? `${alumn.data.nombre} ${alumn.data.apellido}`
                : "Desconocido";
          } catch {
            alumnsResult[rel.alumnoId] = "Desconocido";
          }
        }
      }
      setTutors(tutorResult);
      setAlumns(alumnsResult);
    };

    fetchTutorAndAlumns();
  }, [relations]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Relaciones Tutor-Alumno</Text>
      <FlatList
        data={relations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>
                Tutor: {tutors[item.tutorId] || "Cargando..."}
              </Text>
              <Text style={styles.itemText}>
                Alumno: {alumns[item.alumnoId] || "Cargando..."}
              </Text>
            </View>
            {onEdit && (
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Ionicons name="create-outline" size={24} color="#339999" />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay relaciones registradas.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
  },
  itemText: { fontSize: 15 },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
});
