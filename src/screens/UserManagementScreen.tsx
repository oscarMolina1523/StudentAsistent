import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllUsers, createUser, updateUser, deleteUser, getPaginatedUsers } from '../services/userService'; // Aquí importamos las funciones del servicio
import { Picker } from '@react-native-picker/picker';

export interface User {
  uid: string;
  email: string;
  nombre: string;
  fechaCreacion: string;
  rol: string;
  fotoPerfilUrl: string;
}

const UserManagementScreen = () => {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User>({
    uid: '',
    email: '',
    nombre: '',
    fechaCreacion: '',
    rol: '',
    fotoPerfilUrl: '',
  });

  useEffect(() => {
    fetchPaginatedUsers(1, true);
  }, []);

  const fetchPaginatedUsers = async (pageToLoad: number, reset: boolean = false) => {
    const result = await getPaginatedUsers(pageToLoad, PAGE_SIZE);
    if (result.success) {
      const dataArr = result.data.results || result.data.users || result.data || [];
      setUsers(prev => reset ? dataArr : [...prev, ...dataArr]);
      setPage(pageToLoad);
      setHasMore(dataArr.length === PAGE_SIZE);
    } else {
      console.error(result.message);
      alert(result.message);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (selectedUser) {
      await updateUserDetails(selectedUser.uid);
    } else {
      await createUserDetails();
    }
  };

  const createUserDetails = async () => {
    const result = await createUser(userData);
    if (result.success) {
      fetchPaginatedUsers(1, true);
      setModalVisible(false);
    } else {
      console.error(result.message);
      alert(result.message);
    }
  };

  const updateUserDetails = async (userId: string) => {
    const result = await updateUser(userId, userData);
    if (result.success) {
      fetchPaginatedUsers(1, true);
      setModalVisible(false);
    } else {
      console.error(result.message);
      alert(result.message);
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      fetchPaginatedUsers(1, true);
    } else {
      console.error(result.message);
      alert(result.message);
    }
  };

  const openModal = (user: User | null) => {
    if (user) {
      setSelectedUser(user);
      setUserData(user);
    } else {
      setSelectedUser(null);
      setUserData({
        uid: '',
        email: '',
        nombre: '',
        fechaCreacion: '',
        rol: '',
        fotoPerfilUrl: '',
      });
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => openModal(null)}>
        <Text style={styles.buttonText}>Agregar Usuario</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image source={{ uri: item.fotoPerfilUrl }} style={styles.profilePic} />
            <View style={styles.userInfo}>
              <Text style={styles.userText}>{item.nombre}</Text>
              <Text style={styles.userText}>{item.email}</Text>
              <Text style={styles.userText}>Rol: {item.rol}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Ionicons name="create" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.uid)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => fetchPaginatedUsers(page + 1)}
            >
              <Text style={styles.buttonText}>Cargar más</Text>
            </TouchableOpacity>
          ) : <View style={{ height: 20 }} />
        }
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={userData.nombre}
              onChangeText={(text) => setUserData({ ...userData, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
            <Picker
              selectedValue={userData.rol}
              onValueChange={(value) => setUserData({ ...userData, rol: value })}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar rol..." value="" enabled={false} />
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Tutor" value="tutor" />
              <Picker.Item label="Profesor" value="professor" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Foto de Perfil URL"
              value={userData.fotoPerfilUrl}
              onChangeText={(text) => setUserData({ ...userData, fotoPerfilUrl: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateOrUpdate}>
              <Text style={styles.buttonText}>{selectedUser ? 'Actualizar' : 'Crear'}</Text>
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
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexWrap: 'wrap',
  },
  userText: {
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
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
  picker: {
    height: 50,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default UserManagementScreen;
