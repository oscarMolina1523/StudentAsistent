import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation"; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const handleNavigate = (screen: keyof RootStackParamList) => {
    setVisible(false);
    navigation.navigate(screen as never);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu}>
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={toggleMenu}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Home")}
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
              onPress={() => handleNavigate("Notifications")}
            >
              <Text style={styles.menuText}>Grados</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Notifications")}
            >
              <Text style={styles.menuText}>Materias</Text>
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
