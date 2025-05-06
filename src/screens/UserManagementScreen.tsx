import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE_URL = 'https://backend-fastapi-ten.vercel.app'; // URL de tu API

// Definir la interfaz para el usuario
interface User {
  uid: string;
  email: string;
  nombre: string;
  fechaCreacion: string;
  rol: string;
  fotoPerfilUrl: string;
}

const UserManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error al obtener los usuarios');
    }
  };

  const handleCreateOrUpdate = async () => {
    if (selectedUser) {
      // Actualizar usuario
      await updateUser(selectedUser.uid);
    } else {
      // Crear usuario
      await createUser();
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData);
      if (response.status === 200) {
        fetchUsers();
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario');
    }
  };

  const updateUser = async (userId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
      if (response.status === 200) {
        fetchUsers();
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
      if (response.status === 200) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
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
            <TextInput
              style={styles.input}
              placeholder="Rol"
              value={userData.rol}
              onChangeText={(text) => setUserData({ ...userData, rol: text })}
            />
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
    backgroundColor: 'blue',
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
    flexWrap: 'wrap', // Permitirá que el texto se envuelva si es largo
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexWrap: 'wrap', // Permite que el texto se ajuste al espacio disponible
  },
  userText: {
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

export default UserManagementScreen;
