import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchGrades, createGrade, updateGrade, deleteGrade, Grade } from '../services/gradeService';

const GradeManagementScreen = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [gradeData, setGradeData] = useState<Grade>({
    id: '',
    nombre: '',
    descripcion: '',
    turno: '',
    imagenUrl: '',
  });

  useEffect(() => {
    fetchGradesList();
  }, []);

  // Función para ordenar los grados por su número
  const sortGrades = (grades: Grade[]) => {
    return grades.sort((a, b) => {
      // Extraer el número del grado a partir del nombre (ej. "1ro Primaria" -> 1)
      const aGradeNumber = parseInt(a.nombre.split(' ')[0]);
      const bGradeNumber = parseInt(b.nombre.split(' ')[0]);

      // Ordenar de menor a mayor
      return aGradeNumber - bGradeNumber;
    });
  };

  const fetchGradesList = async () => {
    try {
      const fetchedGrades = await fetchGrades();
      const sortedGrades = sortGrades(fetchedGrades); // Ordenar los grados
      setGrades(sortedGrades);
    } catch (error) {
      alert('Error al obtener los grados');
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (selectedGrade) {
        // Actualizar grado
        await updateGrade(selectedGrade.id, gradeData);
      } else {
        // Crear grado
        await createGrade(gradeData);
      }
      fetchGradesList(); // Refrescar lista después de crear o actualizar
      setModalVisible(false);
    } catch (error) {
      alert('Error al guardar el grado');
    }
  };

  const handleDelete = async (gradeId: string) => {
    try {
      await deleteGrade(gradeId);
      fetchGradesList(); // Refrescar lista después de eliminar
    } catch (error) {
      alert('Error al eliminar el grado');
    }
  };

  const openModal = (grade: Grade | null) => {
    if (grade) {
      setSelectedGrade(grade);
      setGradeData(grade);
    } else {
      setSelectedGrade(null);
      setGradeData({
        id: '',
        nombre: '',
        descripcion: '',
        turno: '',
        imagenUrl: '',
      });
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => openModal(null)}>
        <Text style={styles.buttonText}>Agregar Grado</Text>
      </TouchableOpacity>
      <FlatList
        data={grades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gradeItem}>
            <Image source={{ uri: item.imagenUrl }} style={styles.profilePic} />
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeText}>{item.nombre}</Text>
              <Text style={styles.gradeText}>{item.descripcion}</Text>
              <Text style={styles.gradeText}>{item.turno}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Ionicons name="create" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={gradeData.nombre}
              onChangeText={(text) => setGradeData({ ...gradeData, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={gradeData.descripcion}
              onChangeText={(text) => setGradeData({ ...gradeData, descripcion: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Turno"
              value={gradeData.turno}
              onChangeText={(text) => setGradeData({ ...gradeData, turno: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Imagen URL"
              value={gradeData.imagenUrl}
              onChangeText={(text) => setGradeData({ ...gradeData, imagenUrl: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateOrUpdate}>
              <Text style={styles.buttonText}>{selectedGrade ? 'Actualizar' : 'Crear'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#339999',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    flexWrap: 'wrap', // Permitirá que el texto se envuelva si es largo
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    objectFit: 'contain',
  },
  gradeInfo: {
    flex: 1,
    flexWrap: 'wrap', // Permite que el texto se ajuste al espacio disponible
  },
  gradeText: {
    flexWrap: 'wrap', // Esto permitirá que los textos largos se ajusten sin afectar los botones
    maxWidth: '80%', // Esto asegura que el texto no ocupe todo el ancho disponible
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end', // Asegura que los botones se alineen a la derecha
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default GradeManagementScreen;
