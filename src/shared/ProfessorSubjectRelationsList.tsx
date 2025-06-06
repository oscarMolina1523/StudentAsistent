import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getUserById } from '../services/userService';
import {getAllGradeSubjectRelations} from '../services/relationshipService';
import {getGradeById} from '../services/gradeService';
import {getSubjectDetails} from '../services/subjectServices';

export const ProfessorSubjectRelationsList = ({ relations, onEdit }: { relations: any[]; onEdit?: (item: any) => void }) => {
  const [professors, setProfessors] = useState<Record<string, string>>({});
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [materias, setMaterias] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProfessorsSubjectsGrades = async () => {
      const profResult: Record<string, string> = {};
      const gradesResult: Record<string, string> = {};
      const materiasResult: Record<string, string> = {};
      // Obtener todas las relaciones grado-materia
      const allGradeSubjectRelationsRes = await getAllGradeSubjectRelations();
      const allGradeSubjectRelations = allGradeSubjectRelationsRes.success ? allGradeSubjectRelationsRes.data : [];
      for (const rel of relations) {
        // Profesor
        if (!profResult[rel.profesorId]) {
          const res = await getUserById(rel.profesorId);
          if (res.success) {
            profResult[rel.profesorId] = res.data.nombre;
          } else {
            profResult[rel.profesorId] = "Desconocido";
          }
        }
        // Buscar la relación grado-materia correspondiente
        const found = allGradeSubjectRelations.find((r: any) => r.id === rel.materiaGradoId);
        if (found) {
          // Materia
          if (!materiasResult[rel.materiaGradoId]) {
            try {
              const subject = await getSubjectDetails(found.materiaId);
              materiasResult[rel.materiaGradoId] = subject?.nombre || 'Desconocido';
            } catch {
              materiasResult[rel.materiaGradoId] = 'Desconocido';
            }
          }
          // Grado
          if (!gradesResult[rel.materiaGradoId]) {
            try {
              const grade = await getGradeById(found.gradoId);
              if (grade.success && grade.data && grade.data.nombre) {
                gradesResult[rel.materiaGradoId] = grade.data.nombre;
              } else {
                gradesResult[rel.materiaGradoId] = found.gradoId;
              }
            } catch {
              gradesResult[rel.materiaGradoId] = found.gradoId;
            }
          }
        } else {
          materiasResult[rel.materiaGradoId] = 'Desconocido';
          gradesResult[rel.materiaGradoId] = 'Desconocido';
        }
      }
      setProfessors(profResult);
      setMaterias(materiasResult);
      setGrades(gradesResult);
    };
    fetchProfessorsSubjectsGrades();
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
                Materia: {materias[item.materiaGradoId] || "Cargando..."}
              </Text>
              <Text style={styles.itemText}>
                Grado: {grades[item.materiaGradoId] || "Cargando..."}
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
