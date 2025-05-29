import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation";
import { API_BASE_URL } from "../utils/constants";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ordenarPorNumero = (grades: any[]) => {
    return grades.sort((a, b) => {
      const numeroA = parseInt(a.nombre);
      const numeroB = parseInt(b.nombre);
      return numeroA - numeroB;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole");
        const userId = await AsyncStorage.getItem("userId");
        const idToken = await AsyncStorage.getItem("idToken");
        const headers = {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        };

        if (role === "admin") {
          const response = await axios.get(`${API_BASE_URL}/grades`, headers);
          setGrades(ordenarPorNumero(response.data));
        } else if (role === "profesor" && userId) {
          const response = await axios.get(
            `${API_BASE_URL}/profesor/${userId}/materias`,
            headers
          );
          const subjects = response.data;

          const uniqueGrades: any[] = [];
          const gradeIds = new Set();

          subjects.forEach((subject: any) => {
            if (subject.grado && !gradeIds.has(subject.grado.id)) {
              uniqueGrades.push(subject.grado);
              gradeIds.add(subject.grado.id);
            }
          });

          setGrades(ordenarPorNumero(uniqueGrades));
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const matutinoGrades = grades.filter(
    (grade) => grade.turno?.trim().toLowerCase() === "matutino"
  );
  const vespertinoGrades = grades.filter(
    (grade) => grade.turno?.trim().toLowerCase() === "vespertino"
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const renderGradeSection = (title: string, gradeList: any[]) => (
    <>
      {gradeList.length > 0 && <Text style={styles.turnoTitle}>{title}</Text>}
      <View style={styles.grid}>
        {gradeList.map((grade) => (
          <TouchableOpacity
            key={grade.id}
            style={styles.gradeCard}
            onPress={() =>
              navigation.navigate("SubjectsByGradeScreen", {
                gradeId: grade.id,
              })
            }
          >
            <Image
              source={{ uri: grade.imagenUrl }}
              style={styles.gradeImage}
            />
            <Text style={styles.gradeText}>{grade.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/vector-gratis/vector-fondo-verde-blanco-simple-negocios_53876-174913.jpg",
      }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bienvenido nuevamente!</Text>
        {grades.length === 0 ? (
          <View style={styles.noGradesContainer}>
            <Text style={styles.noGradesText}>
              Aún no se te ha asignado nada
            </Text>
          </View>
        ) : (
          <>
            {renderGradeSection("Turno Matutino", matutinoGrades)}
            {renderGradeSection("Turno Vespertino", vespertinoGrades)}
          </>
        )}
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
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  turnoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "left",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gradeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: "48%",
    alignItems: "center",
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 9,
  },
  gradeImage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    objectFit: "contain",
  },
  gradeText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noGradesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noGradesText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
});

export default HomeScreen;
