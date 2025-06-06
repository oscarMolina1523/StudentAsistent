import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getUserById } from '../services/userService';
import {getSubjectDetails} from '../services/subjectServices';

export const ProfessorSubjectRelationsList = ({ relations, onEdit }) => {
  const [professors, setProfessors] = useState({});
  const [subjects, setSubjects] = useState({});

  useEffect(() => {
    const fetchProfessors = async () => {
      const result: Record<string, string> = {};
      for (const rel of relations) {
        if (!result[rel.profesorId]) {
          const res = await getUserById(rel.profesorId);
          if (res.success) {
            result[rel.profesorId] = res.data.nombre;
          } else {
            result[rel.profesorId] = "Desconocido";
          }
        }
      }
      setProfessors(result);
    };

    fetchProfessors();
  }, [relations]);

  return (  // 🔹 Este return era lo que faltaba
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Relaciones Profesor-Materia</Text>
      <FlatList
        data={relations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>
                Profesor: {professors[item.profesorId] || "Cargando..."}
              </Text>
              <Text style={styles.itemText}>
                Materia: {item.materiaGradoId}
              </Text>
              <Text style={styles.itemText}>
                Turno: {item.turno} | Año: {item.anioEscolar}
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
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10
  },
  itemText: { fontSize: 15 },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10
  },
});
