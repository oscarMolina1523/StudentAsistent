import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const grades = [
    { id: 1, name: 'Primer Grado', image: { uri: 'https://i.pinimg.com/474x/ee/06/6d/ee066ddb6dca34e9b4b69acc5abf6cfa.jpg' } },
    { id: 2, name: 'Segundo Grado', image: { uri: 'https://i.pinimg.com/236x/09/f1/c5/09f1c52863a176de934639a9265766e9.jpg' } },
    { id: 3, name: 'Tercer Grado', image: { uri: 'https://i.pinimg.com/236x/7e/63/87/7e6387d65721f106e40cb543ed739b55.jpg' } },
    { id: 4, name: 'Cuarto Grado', image: { uri: 'https://i.pinimg.com/474x/bd/5e/ca/bd5ecabe37705cdf796a63385c4af5aa.jpg' } },
    { id: 5, name: 'Quinto Grado', image: { uri: 'https://i.pinimg.com/474x/8a/8d/43/8a8d4325daa0f0e2fc993b5e8eb2c506.jpg' } },
    { id: 6, name: 'Sexto Grado', image: { uri: 'https://i.pinimg.com/236x/9b/32/13/9b321387f2daf1cebdc92aad09b0a8ec.jpg' } },
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
