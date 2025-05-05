import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserExtendedInfo, updateUser } from '../services/userService';

const ProfileScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState(''); // ✅ nuevo estado para el rol

  useEffect(() => {
    const loadUserData = async () => {
      const id = await AsyncStorage.getItem('userId');
      const storedRole = await AsyncStorage.getItem('userRole'); // ✅ obtener el rol
      if (storedRole) setRole(storedRole);

      if (id) {
        setUserId(id);
        const response = await getUserExtendedInfo(id);
        if (response.success) {
          const user = response.data.user;
          setUserData(user);
          setName(user.nombre);
          setEmail(user.email);
        }
      }
    };
    loadUserData();
  }, []);

  const handleEditProfile = async () => {
    if (!userData) return;

    const updatedUser = {
      ...userData,
      nombre: name,
      email: email,
    };

    const result = await updateUser(userId, updatedUser);
    if (result.success) {
      setUserData(updatedUser);
      setModalVisible(false);
    } else {
      console.error('Error al actualizar:', result.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userId', 'userRole', 'idToken', 'refreshToken', 'email']);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userData?.fotoPerfilUrl || 'https://i.pinimg.com/474x/ee/06/6d/ee066ddb6dca34e9b4b69acc5abf6cfa.jpg' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* ✅ Mostrar solo si es admin */}
      {role === 'admin' && (
        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]}>
          <Text style={styles.buttonText}>Administrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={[styles.button, { width: '100%' }]} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton, { width: '100%' }]}
              onPress={() => setModalVisible(false)}
            >
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
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 120, height: 120, borderRadius: 60, marginBottom: 20,
  },
  name: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10,
  },
  email: {
    fontSize: 18, color: '#666', marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20,
    marginBottom: 10, width: '80%', alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#FFFFFF', fontSize: 18, fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%',
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 10,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, width: '100%',
  },
});

export default ProfileScreen;
