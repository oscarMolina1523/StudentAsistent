import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const students = [
    // Primer Grado
    { id: 1, name: 'Juan Pérez', gradeId: 1 },
    { id: 2, name: 'Ana Gómez', gradeId: 1 },
    { id: 3, name: 'Luis Martínez', gradeId: 1 },
    { id: 4, name: 'Sofía López', gradeId: 1 },
    { id: 5, name: 'Carlos Sánchez', gradeId: 1 },
    { id: 6, name: 'María Fernández', gradeId: 1 },
    { id: 7, name: 'Pedro Ramírez', gradeId: 1 },
    { id: 8, name: 'Lucía Torres', gradeId: 1 },
    { id: 9, name: 'Diego Morales', gradeId: 1 },
    { id: 10, name: 'Valentina Ruiz', gradeId: 1 },
  
    // Segundo Grado
    { id: 11, name: 'Mateo Díaz', gradeId: 2 },
    { id: 12, name: 'Isabella Castro', gradeId: 2 },
    { id: 13, name: 'Sebastián Herrera', gradeId: 2 },
    { id: 14, name: 'Camila Jiménez', gradeId: 2 },
    { id: 15, name: 'Andrés Vargas', gradeId: 2 },
    { id: 16, name: 'Valeria Peña', gradeId: 2 },
    { id: 17, name: 'Nicolás Salazar', gradeId: 2 },
    { id: 18, name: 'Emilia Ortega', gradeId: 2 },
    { id: 19, name: 'Felipe Cordero', gradeId: 2 },
    { id: 20, name: 'Renata Paredes', gradeId: 2 },
  
    // Tercer Grado
    { id: 21, name: 'Joaquín Soto', gradeId: 3 },
    { id: 22, name: 'Mariana Ríos', gradeId: 3 },
    { id: 23, name: 'Samuel Aguirre', gradeId: 3 },
    { id: 24, name: 'Victoria Castro', gradeId: 3 },
    { id: 25, name: 'Gonzalo Medina', gradeId: 3 },
    { id: 26, name: 'Santiago León', gradeId: 3 },
    { id: 27, name: 'Mía Silva', gradeId: 3 },
    { id: 28, name: 'Dante Romero', gradeId: 3 },
    { id: 29, name: 'Lola Ceballos', gradeId: 3 },
    { id: 30, name: 'Rafael Torres', gradeId: 3 },
  
    // Cuarto Grado
    { id: 31, name: 'Álvaro Ruiz', gradeId: 4 },
    { id: 32, name: 'Sofía Morales', gradeId: 4 },
    { id: 33, name: 'Diego Salas', gradeId: 4 },
    { id: 34, name: 'Lucía Castro', gradeId: 4 },
    { id: 35, name: 'Julián Pérez', gradeId: 4 },
    { id: 36, name: 'Camila López', gradeId: 4 },
    { id: 37, name: 'Emilio Fernández', gradeId: 4 },
    { id: 38, name: 'Valentina Ríos', gradeId: 4 },
    { id: 39, name: 'Mateo Jiménez', gradeId: 4 },
    { id: 40, name: 'Isabella Torres', gradeId: 4 },
  
    // Quinto Grado
    { id: 41, name: 'Lucas Martínez', gradeId: 5 },
    { id: 42, name: 'María José González', gradeId: 5 },
    { id: 43, name: 'Nicolás Ramírez', gradeId: 5 },
    { id: 44, name: 'Valeria Salazar', gradeId: 5 },
    { id: 45, name: 'Andrés Cordero', gradeId: 5 },
    { id: 46, name: 'Sofía Méndez', gradeId : 5 },
    { id: 47, name: 'Diego Torres', gradeId: 5 },
    { id: 48, name: 'Camila Ruiz', gradeId: 5 },
    { id: 49, name: 'Felipe González', gradeId: 5 },
    { id: 50, name: 'Valentina Castro', gradeId: 5 },
  
    // Sexto Grado
    { id: 51, name: 'Javier López', gradeId: 6 },
    { id: 52, name: 'Lucía Martínez', gradeId: 6 },
    { id: 53, name: 'Mateo Ramírez', gradeId: 6 },
    { id: 54, name: 'Emilia Fernández', gradeId: 6 },
    { id: 55, name: 'Andrés Salas', gradeId: 6 },
    { id: 56, name: 'Sofía Cordero', gradeId: 6 },
    { id: 57, name: 'Nicolás Ortega', gradeId: 6 },
    { id: 58, name: 'Valeria Ríos', gradeId: 6 },
    { id: 59, name: 'Diego Aguirre', gradeId: 6 },
    { id: 60, name: 'Mariana Peña', gradeId: 6 },
  ];

  return (
    <ImageBackground 
    source={{ uri: "https://img.freepik.com/vector-gratis/vector-fondo-verde-blanco-simple-negocios_53876-174913.jpg?t=st=1745869550~exp=1745873150~hmac=9d7dbe401017644b95f9ddb401bf1291cdac6d71398f87ae96ea1d0e229884b6&w=740" }} // Reemplaza con la URL de tu imagen
    style={styles.background}
    >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido nuevamente!</Text>
      <View style={styles.grid}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade.id}
            style={styles.gradeCard}
            onPress={() => navigation.navigate('StudentDetailsScreen', { gradeId: grade.id })}
          >
            <Image source={grade.image} style={styles.gradeImage} />
            <Text style={styles.gradeText}>{grade.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View> */}
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gradeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    width: '48%',
    alignItems: 'center',
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 9,
  },
  gradeImage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    objectFit: 'contain',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default HomeScreen;
