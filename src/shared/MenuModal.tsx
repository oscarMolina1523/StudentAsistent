import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomMenu = () => {
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState<string>(''); // Para almacenar el rol del usuario ya sea admin , tutor o profesor
  const navigation = useNavigation<NavigationProp>();

  // Obtener el rol del usuario cuando se monta el componente
  useEffect(() => {
    const loadRole = async () => {
      const storedRole = await AsyncStorage.getItem("userRole"); 
      if (storedRole) setRole(storedRole); 
    };
    loadRole();
  }, []);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const handleNavigate = (screen: keyof RootStackParamList) => {
    setVisible(false);
    navigation.navigate(screen as never);
  };

  return (
    <View>
      {/* Solo muestra el icono del menú si el rol es "admin" */}
      {role === 'admin' && (
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
      )}
      
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={toggleMenu}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("UserManagementScreen")}
            >
              <Text style={styles.menuText}>Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("StudentManagementScreen")}
            >
              <Text style={styles.menuText}>Estudiantes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("GradeManagementScreen")}
            >
              <Text style={styles.menuText}>Grados</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("SubjectManagementScreen")}
            >
              <Text style={styles.menuText}>Materias</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("RelationshipManagementScreen")}
            >
              <Text style={styles.menuText}>Asignar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("AttendanceChart")}
            >
              <Text style={styles.menuText}>Graficos</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingTop: 60,
    paddingLeft: 10,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    width: 200,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
  },
  menuText: {
    fontSize: 16,
  },
});

export default CustomMenu;
