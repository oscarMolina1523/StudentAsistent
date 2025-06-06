import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getGradeById } from '../services/gradeService';
import { getSubjectDetails } from '../services/subjectServices';

interface Relation {
  id: string;
  gradoId: string;
  materiaId: string;
  materiaNombre?: string;
  semestre?: string;
}

interface GradeSubjectRelationsListProps {
  relations: Relation[];
  onEdit?: (item: Relation) => void;
}

export const GradeSubjectRelationsList = ({ relations, onEdit }: GradeSubjectRelationsListProps) => {
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [materias, setMaterias] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchGradesAndSubjects = async () => {
      const gradesResult: Record<string, string> = {};
      const materiasResult: Record<string, string> = {};
      for (const rel of relations) {
        if (!gradesResult[rel.gradoId]) {
          const res = await getGradeById(rel.gradoId);
          if (res.success) {
            gradesResult[rel.gradoId] = res.data.nombre;
          } else {
            gradesResult[rel.gradoId] = "Desconocido";
          }
        }
        if (!materiasResult[rel.materiaId]) {
          try {
            const subject = await getSubjectDetails(rel.materiaId);
            materiasResult[rel.materiaId] = subject?.nombre || 'Desconocido';
          } catch {
            materiasResult[rel.materiaId] = 'Desconocido';
          }
        }
      }
      setGrades(gradesResult);
      setMaterias(materiasResult);
    };

    fetchGradesAndSubjects();
  }, [relations]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Relaciones Grado-Materia</Text>
      <FlatList
        data={relations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>
                Grado: {grades[item.gradoId] || "Cargando..."}
              </Text>
              <Text style={styles.itemText}>Materia: {materias[item.materiaId] || "Cargando..."}</Text>
              <Text style={styles.itemText}>Semestre: {item.semestre}</Text>
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
  }
});
