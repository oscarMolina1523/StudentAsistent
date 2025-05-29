import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  createTutorStudentRelation,
  createProfessorSubjectRelation,
  createGradeSubjectRelation,
} from "../services/relationshipService";
import { fetchGrades } from "../services/gradeService";
import { getAllStudents } from "../services/studentService";
import { fetchSubjects, getSubjectsByGrade } from "../services/subjectServices";
import { getUsersByRole } from "../services/userService";
import axios from "axios";

const RelationshipScreen = () => {
  const [relationType, setRelationType] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [alumnoId, setAlumnoId] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [materiaGradoId, setMateriaGradoId] = useState(""); // Este es el ID de la relación entre materia y grado
  const [materiaId, setMateriaId] = useState("");
  const [turno, setTurno] = useState("mañana");
  const [anioEscolar, setAnioEscolar] = useState(2025);
  const [gradoId, setGradoId] = useState("");
  const [semestre, setSemestre] = useState(1);

  const [tutores, setTutores] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grados, setGrados] = useState([]);

  const parseMessage = (message) => {
    return Array.isArray(message) ? message.join("\n") : String(message);
  };

  useEffect(() => {
    fetchTutores();
    fetchAlumnos();
    fetchProfesores();
    fetchGrados();
  }, []);

  useEffect(() => {
    if (relationType === "grade-subject" && gradoId) {
      fetchAllMaterias();
    } else if (relationType === "professor-subject" && gradoId) {
      fetchGradeSubjectRelations(gradoId);
    }
  }, [gradoId, relationType]);

  const fetchTutores = async () => {
    const response = await getUsersByRole("tutor");
    if (response.success) {
      setTutores(response.data);
      if (!tutorId && response.data.length > 0) setTutorId(response.data[0].id);
    } else {
      Alert.alert("Error", "No se pudo cargar los tutores");
    }
  };

  const fetchProfesores = async () => {
    const response = await getUsersByRole("profesor");
    if (response.success) {
      setProfesores(response.data);
      if (!profesorId && response.data.length > 0)
        setProfesorId(response.data[0].id);
    } else {
      Alert.alert("Error", "No se pudo cargar los profesores");
    }
  };

  const fetchAlumnos = async () => {
    const response = await getAllStudents();
    if (response.success) {
      setAlumnos(response.data);
      if (!alumnoId && response.data.length > 0)
        setAlumnoId(response.data[0].id);
    } else {
      Alert.alert("Error", "No se pudo cargar los alumnos");
    }
  };

  const fetchGrados = async () => {
    const response = await fetchGrades();
    setGrados(response);
    if (!gradoId && response.length > 0) setGradoId(response[0].id);
  };

  const fetchAllMaterias = async () => {
    try {
      const subjects = await fetchSubjects();
      setMaterias(subjects);
      if (!materiaId && subjects.length > 0) setMateriaId(subjects[0].id);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las materias");
    }
  };

  const fetchGradeSubjectRelations = async (gradoId) => {
    try {
      const subjects = await getSubjectsByGrade(gradoId); // ← usa tu función ya lista
      const formatted = subjects.map((s) => ({
        id: s.materiaGradoId,
        nombre: s.nombre,
      }));
      console.log("Payload enviado:", {
        profesorId,
        materiaGradoId,
        turno,
        anioEscolar,
      });

      setMaterias(formatted);
      if (!materiaGradoId && formatted.length > 0)
        setMateriaGradoId(formatted[0].id);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudieron cargar las relaciones grado-materia"
      );
    }
  };

  const handleSubmit = async () => {
    if (relationType === "tutor-student" && tutorId && alumnoId) {
      const result = await createTutorStudentRelation(tutorId, alumnoId);
      if (result.success) {
        Alert.alert("Éxito", "Relación Tutor-Alumno creada con éxito");
      } else {
        Alert.alert("Error", parseMessage(result.message));
      }
    } else if (
      relationType === "professor-subject" &&
      profesorId &&
      materiaGradoId && // Aquí enviamos la relación correcta
      turno &&
      anioEscolar
    ) {
      const result = await createProfessorSubjectRelation(
        profesorId,
        materiaGradoId,
        turno,
        anioEscolar
      );
      if (result.success) {
        Alert.alert("Éxito", "Relación Profesor-Materia creada con éxito");
      } else {
        Alert.alert("Error", parseMessage(result.message));
      }
    } else if (
      relationType === "grade-subject" &&
      gradoId &&
      materiaId &&
      semestre
    ) {
      const result = await createGradeSubjectRelation(
        gradoId,
        materiaId,
        semestre
      );
      if (result.success) {
        Alert.alert("Éxito", "Relación Grado-Materia creada con éxito");
      } else {
        Alert.alert("Error", parseMessage(result.message));
      }
    } else {
      Alert.alert("Error", "Por favor completa todos los campos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Relaciones</Text>

      <Text>Tipo de Relación:</Text>
      <Picker selectedValue={relationType} onValueChange={setRelationType}>
        <Picker.Item label="Seleccione..." value="" />
        <Picker.Item label="Tutor-Alumno" value="tutor-student" />
        <Picker.Item label="Profesor-Materia" value="professor-subject" />
        <Picker.Item label="Grado-Materia" value="grade-subject" />
      </Picker>

      {relationType === "tutor-student" && (
        <>
          <Text>Tutor:</Text>
          <Picker selectedValue={tutorId} onValueChange={setTutorId}>
            {tutores.map((tutor) => (
              <Picker.Item
                key={tutor.id}
                label={tutor.nombre}
                value={tutor.id}
              />
            ))}
          </Picker>

          <Text>Alumno:</Text>
          <Picker selectedValue={alumnoId} onValueChange={setAlumnoId}>
            {alumnos.map((alumno) => (
              <Picker.Item
                key={alumno.id}
                label={`${alumno.nombre} ${alumno.apellido}`}
                value={alumno.id}
              />
            ))}
          </Picker>
        </>
      )}

      {relationType === "professor-subject" && (
        <>
          <Text>Grado:</Text>
          <Picker selectedValue={gradoId} onValueChange={setGradoId}>
            {grados.map((grado) => (
              <Picker.Item
                key={grado.id}
                label={`${grado.nombre} (${grado.turno})`}
                value={grado.id}
              />
            ))}
          </Picker>

          <Text>Profesor:</Text>
          <Picker selectedValue={profesorId} onValueChange={setProfesorId}>
            {profesores.map((profesor) => (
              <Picker.Item
                key={profesor.id}
                label={profesor.nombre}
                value={profesor.id}
              />
            ))}
          </Picker>

          <Text>Materia:</Text>
          <Picker
            selectedValue={materiaGradoId}
            onValueChange={setMateriaGradoId}
          >
            {materias.map((materia) => (
              <Picker.Item
                key={materia.id}
                label={materia.nombre}
                value={materia.id}
              />
            ))}
          </Picker>

          <Text>Turno:</Text>
          <Picker selectedValue={turno} onValueChange={setTurno}>
            <Picker.Item label="Mañana" value="mañana" />
            <Picker.Item label="Tarde" value="tarde" />
          </Picker>

          <Text>Año Escolar:</Text>
          <Picker selectedValue={anioEscolar} onValueChange={setAnioEscolar}>
            <Picker.Item label="2025" value={2025} />
            <Picker.Item label="2026" value={2026} />
          </Picker>
        </>
      )}

      {relationType === "grade-subject" && (
        <>
          <Text>Grado:</Text>
          <Picker selectedValue={gradoId} onValueChange={setGradoId}>
            {grados.map((grado) => (
              <Picker.Item
                key={grado.id}
                label={`${grado.nombre} (${grado.turno})`}
                // label={grado.nombre}
                value={grado.id}
              />
            ))}
          </Picker>

          <Text>Materia:</Text>
          <Picker selectedValue={materiaId} onValueChange={setMateriaId}>
            {materias.map((materia) => (
              <Picker.Item
                key={materia.id}
                label={materia.nombre}
                value={materia.id}
              />
            ))}
          </Picker>

          <Text>Semestre:</Text>
          <Picker selectedValue={semestre} onValueChange={setSemestre}>
            <Picker.Item label="1" value={1} />
            <Picker.Item label="2" value={2} />
          </Picker>
        </>
      )}

      {/* <Button title="Crear Relación" onPress={handleSubmit} /> */}
      <TouchableOpacity style={styles.button}  onPress={handleSubmit}>
        <Text style={styles.buttonText}>Crear Relación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: '#339999',
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
});

export default RelationshipScreen;
