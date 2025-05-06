import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchSubjects, createSubject, updateSubject, deleteSubject, Subject } from '../services/subjectServices';

const SubjectManagementScreen = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectData, setSubjectData] = useState<Omit<Subject, 'id'>>({
    nombre: '',
    imagenUrl: '',
  });

  useEffect(() => {
    fetchSubjectsList();
  }, []);

  const fetchSubjectsList = async () => {
    try {
      const fetched = await fetchSubjects();
      const sorted = fetched.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Orden alfabético
      setSubjects(sorted);
    } catch (error) {
      alert('Error al obtener las materias');
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (selectedSubject) {
        await updateSubject(selectedSubject.id, subjectData);
      } else {
        await createSubject(subjectData);
      }
      fetchSubjectsList();
      setModalVisible(false);
    } catch (error) {
      alert('Error al guardar la materia');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      fetchSubjectsList();
    } catch (error) {
      alert('Error al eliminar la materia');
    }
  };

  const openModal = (subject: Subject | null) => {
    if (subject) {
      setSelectedSubject(subject);
      setSubjectData({
        nombre: subject.nombre,
        imagenUrl: subject.imagenUrl,
      });
    } else {
      setSelectedSubject(null);
      setSubjectData({ nombre: '', imagenUrl: '' });
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => openModal(null)}>
        <Text style={styles.buttonText}>Agregar Materia</Text>
      </TouchableOpacity>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imagenUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.nombre}</Text>
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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={subjectData.nombre}
              onChangeText={(text) => setSubjectData({ ...subjectData, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Imagen URL"
              value={subjectData.imagenUrl}
              onChangeText={(text) => setSubjectData({ ...subjectData, imagenUrl: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateOrUpdate}>
              <Text style={styles.buttonText}>{selectedSubject ? 'Actualizar' : 'Crear'}</Text>
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
  button: {
    backgroundColor: '#339999',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default SubjectManagementScreen;
