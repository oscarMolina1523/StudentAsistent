import React from "react";
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

const RegisterScreen = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={{ uri: "https://img.freepik.com/foto-gratis/caja-kraft-azul-lindo-empaque-producto-patron-arcilla_53876-125920.jpg?t=st=1745698490~exp=1745702090~hmac=d3c0162afd101511be4de8e2707db9fe4122eb2e28b5376f0b99b1b70847aa95&w=740" }} // Reemplaza con la URL de tu imagen
      style={styles.background}
    >
      <View style={styles.glassContainer}>
        <Text style={styles.title}>Registro de cuenta</Text>
        <TextInput style={styles.input} placeholder="Name" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>
            Registrarse
          </Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text>¿Ya tienes una cuenta?</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Iniciar Sesion
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
  },
  glassContainer: {
    flex: 0.8, 
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fondo semitransparente
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
    fontWeight: 'bold'
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

export default RegisterScreen;