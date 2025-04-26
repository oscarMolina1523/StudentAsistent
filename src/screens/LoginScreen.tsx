import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesion con cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <Button
        title="Iniciar Sesion"
        onPress={() => navigation.navigate("Home")}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginVertical: 10,
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text >¿No tienes una cuenta?</Text>
        <Text style={{ color: "blue" }} onPress={() => navigation.navigate("Register")}>Registrarse</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default LoginScreen;
