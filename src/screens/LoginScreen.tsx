import React from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();
  return (
    <ImageBackground
      source={{ uri: "https://img.freepik.com/vector-gratis/hojas-tropicales-estilo-abstracto_23-2148538088.jpg?t=st=1745698739~exp=1745702339~hmac=6d94cbc1487c3a7d06661faf5688f278e36f3578f700f3da3aab2d9278e70f2a&w=740" }}
      style={styles.background}
    >
      <View style={styles.glassContainer}>
        <Text style={styles.title}>Iniciar Sesion con cuenta</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
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
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
  },
  glassContainer: {
    flex: 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
