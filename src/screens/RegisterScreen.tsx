import React from "react";
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

const RegisterScreen = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={{ uri: "https://img.freepik.com/vector-gratis/vector-fondo-verde-blanco-simple-negocios_53876-174913.jpg?t=st=1745869550~exp=1745873150~hmac=9d7dbe401017644b95f9ddb401bf1291cdac6d71398f87ae96ea1d0e229884b6&w=740" }} // Reemplaza con la URL de tu imagen
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
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Fondo semitransparente
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