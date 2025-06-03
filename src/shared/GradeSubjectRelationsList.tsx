import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const GradeSubjectRelationsList = ({ relations, onEdit }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Relaciones Grado-Materia</Text>
    <FlatList
      data={relations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemText}>Grado: {item.gradoNombre}</Text>
            <Text style={styles.itemText}>Materia: {item.materiaNombre}</Text>
            <Text style={styles.itemText}>Semestre: {item.semestre}</Text>
          </View>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Ionicons name="create-outline" size={24} color="#339999" />
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No hay relaciones registradas.</Text>}
    />
  </View>
);

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 10 },
  itemText: { fontSize: 15 },
  emptyText: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
});
