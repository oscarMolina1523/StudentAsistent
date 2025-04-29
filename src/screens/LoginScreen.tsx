import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";
import { login } from "../services/authService";

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await login(email, password);

      if (result.success) {
        // Navigate to the "Home" screen upon successful login
        navigation.navigate("Home");
      } else {
        // Show an alert with the error message
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://img.freepik.com/vector-gratis/vector-fondo-verde-blanco-simple-negocios_53876-174913.jpg?t=st=1745869550~exp=1745873150~hmac=9d7dbe401017644b95f9ddb401bf1291cdac6d71398f87ae96ea1d0e229884b6&w=740" }}
      style={styles.background}
    >
      <View style={styles.glassContainer}>
        <Text style={styles.title}>Iniciar Sesion con cuenta</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesion</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text>¿No tienes una cuenta?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
            Registrarse
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
  },
  glassContainer: {
    flex: 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  link: {
    color: "blue",
    marginLeft: 5,
  },
});

export default LoginScreen;
