import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation';

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido nuevamente!</Text>
      <View style={styles.grid}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade.id}
            style={styles.gradeCard}
            onPress={() => navigation.navigate('Register')}
          >
            <Image source={grade.image} style={styles.gradeImage} />
            <Text style={styles.gradeText}>{grade.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
});

export default HomeScreen;
