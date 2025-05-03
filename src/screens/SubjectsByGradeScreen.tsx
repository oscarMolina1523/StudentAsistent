// screens/SubjectsByGradeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGradeById, getSubjectsByGrade } from '../services/subjectServices';

const SubjectsByGradeScreen = ({ route, navigation }: any) => {
  const { gradeId } = route.params;
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeName, setGradeName] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const idToken = await AsyncStorage.getItem('idToken');
        if (idToken) {
          const subjectsData = await getSubjectsByGrade(gradeId);
          const grade = await getGradeById(gradeId);
          setSubjects(subjectsData);
          setGradeName(grade.nombre);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [gradeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando materias...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Materias del {gradeName}</Text>
      <View style={styles.grid}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={styles.subjectCard}
            onPress={() => navigation.navigate('SubjectDetailsScreen', { subjectId: subject.id })}
          >
            <Image source={{ uri: subject.imagenUrl }} style={styles.subjectImage} />
            <Text style={styles.subjectText}>{subject.nombre}</Text>
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
  subjectCard: {
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
  subjectImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    objectFit: 'contain',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubjectsByGradeScreen;
