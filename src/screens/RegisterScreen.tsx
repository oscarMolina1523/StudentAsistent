import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const RegisterScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <Button title="Register" onPress={() => navigation.navigate("Home")} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginVertical: 10,
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text>¿Ya tienes una cuenta?</Text>
        <Text
          style={{ color: "blue" }}
          onPress={() => navigation.navigate("Login")}
        >
          Iniciar Sesion
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default RegisterScreen;
