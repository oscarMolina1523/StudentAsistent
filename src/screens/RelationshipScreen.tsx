import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
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
import { ProfessorSubjectRelationsList } from '../shared/ProfessorSubjectRelationsList';
import { GradeSubjectRelationsList } from '../shared/GradeSubjectRelationsList';
import { TutorStudentRelationsList } from '../shared/TutorStudentRelationsList';
import { getAllProfessorSubjects } from '../services/professorSubjectService';
import { getAllGradeSubjectRelations, getTutorStudentRelations } from '../services/relationshipService';
import { Subject, ProfessorSubject, Grade, TutorStudentRelation } from '../models/Models';

const PAGE_SIZE = 10;

const RelationshipScreen = () => {
  const [relationType, setRelationType] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [alumnoId, setAlumnoId] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [materiaGradoId, setMateriaGradoId] = useState(""); 
  const [materiaId, setMateriaId] = useState("");
  const [turno, setTurno] = useState("mañana");
  const [anioEscolar, setAnioEscolar] = useState(2025);
  const [gradoId, setGradoId] = useState("");
  const [semestre, setSemestre] = useState(1);

  const [mode, setMode] = useState<'crear' | 'ver' | 'editar'>('crear');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  // Paginación para cada lista
  const [profPage, setProfPage] = useState<number>(1);
  const [gradePage, setGradePage] = useState<number>(1);
  const [tutorPage, setTutorPage] = useState<number>(1);

  // Estados tipados
  const [tutores, setTutores] = useState<any[]>([]);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [profesores, setProfesores] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [grados, setGrados] = useState<Grade[]>([]);
  const [professorSubjectRelations, setProfessorSubjectRelations] = useState<ProfessorSubject[]>([]);
  const [gradeSubjectRelations, setGradeSubjectRelations] = useState<any[]>([]);
  const [tutorStudentRelations, setTutorStudentRelations] = useState<TutorStudentRelation[]>([]);
  const [loadingRelations, setLoadingRelations] = useState(false);

  // Nuevo: tipo de relación a ver/editar
  const [viewRelationType, setViewRelationType] = useState<string>("professor-subject");

  const parseMessage = (message: any) => {
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

  const fetchAllRelations = async () => {
    setLoadingRelations(true);
    try {
      // Profesor-Materia
      const profRes = await getAllProfessorSubjects();
      // Grado-Materia
      const gradeRes = await getAllGradeSubjectRelations();
      // Tutor-Alumno
      const tutorRes = await getTutorStudentRelations();
      setProfessorSubjectRelations(
        profRes.map((r) => ({
          ...r,
          profesorNombre: r.profesorNombre || r.profesorId || '',
          materiaNombre: r.materiaNombre || r.materiaId || '',
        }))
      );
      setGradeSubjectRelations(
        gradeRes.success ? gradeRes.data.map((r) => ({
          ...r,
          gradoNombre: r.gradoNombre || r.gradoId || '',
          materiaNombre: r.materiaNombre || r.materiaId || '',
        })) : []
      );
      setTutorStudentRelations(
        tutorRes.map((r) => ({
          ...r,
          tutorNombre: r.tutorNombre || r.tutorId || '',
          alumnoNombre: r.alumnoNombre || r.alumnoId || '',
        }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRelations(false);
    }
  };

  // Solo cargar relaciones si modo es 'ver' o 'editar'
  useEffect(() => {
    if (mode === 'ver' || mode === 'editar') {
      fetchAllRelations();
    }
  }, [mode]);

  // Helpers para obtener data y paginación según tipo
  const getCurrentRelations = () => {
    if (viewRelationType === "professor-subject") return professorSubjectRelations;
    if (viewRelationType === "grade-subject") return gradeSubjectRelations;
    if (viewRelationType === "tutor-student") return tutorStudentRelations;
    return [];
  };
  const getCurrentPage = () => {
    if (viewRelationType === "professor-subject") return profPage;
    if (viewRelationType === "grade-subject") return gradePage;
    if (viewRelationType === "tutor-student") return tutorPage;
    return 1;
  };
  const setCurrentPage = (page: number) => {
    if (viewRelationType === "professor-subject") setProfPage(page);
    if (viewRelationType === "grade-subject") setGradePage(page);
    if (viewRelationType === "tutor-student") setTutorPage(page);
  };
  const getTotalPages = () => {
    const data = getCurrentRelations();
    return Math.ceil(data.length / PAGE_SIZE) || 1;
  };

  // Paginación helpers
  function getPaginated<T>(arr: T[], page: number): T[] {
    return arr.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  }
  const profTotalPages = Math.ceil(professorSubjectRelations.length / PAGE_SIZE) || 1;
  const gradeTotalPages = Math.ceil(gradeSubjectRelations.length / PAGE_SIZE) || 1;
  const tutorTotalPages = Math.ceil(tutorStudentRelations.length / PAGE_SIZE) || 1;

  // Modal de edición simulado
  function handleFakeEdit(item: any) {
    setEditItem(item);
    setShowEditModal(true);
  }

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
      <Text style={styles.title}>Gestión de Relaciones</Text>
      {/* Tabs/Modo */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, mode==='crear' && styles.tabActive]} onPress={()=>setMode('crear')}><Text style={styles.tabText}>Crear</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode==='ver' && styles.tabActive]} onPress={()=>setMode('ver')}><Text style={styles.tabText}>Ver</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode==='editar' && styles.tabActive]} onPress={()=>setMode('editar')}><Text style={styles.tabText}>Editar</Text></TouchableOpacity>
      </View>

      {/* Selector de tipo de relación para ver/editar con scroll horizontal */}
      {(mode==='ver' || mode==='editar') && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16,  }} contentContainerStyle={{ flexDirection: 'row', gap: 10, height: 40 }}>
          <TouchableOpacity style={[styles.tab, viewRelationType==='professor-subject' && styles.tabActive]} onPress={()=>setViewRelationType('professor-subject')}><Text style={styles.tabText}>Profesor-Materia</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tab, viewRelationType==='grade-subject' && styles.tabActive]} onPress={()=>setViewRelationType('grade-subject')}><Text style={styles.tabText}>Grado-Materia</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tab, viewRelationType==='tutor-student' && styles.tabActive]} onPress={()=>setViewRelationType('tutor-student')}><Text style={styles.tabText}>Tutor-Alumno</Text></TouchableOpacity>
        </ScrollView>
      )}

      {/* Crear relaciones */}
      {mode==='crear' && (
        <>
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
        </>
      )}

      {/* Ver/Editar relaciones */}
      {(mode==='ver' || mode==='editar') && (
        <View style={{ marginVertical: 20, flex: 1 }}>
          {loadingRelations ? (
            <Text style={{ textAlign: 'center', color: '#888' }}>Cargando relaciones...</Text>
          ) : (
            <>
              {viewRelationType === 'professor-subject' && (
                <>
                  <ProfessorSubjectRelationsList 
                    relations={getPaginated(professorSubjectRelations, profPage)} 
                    onEdit={mode==='editar' ? handleFakeEdit : undefined} 
                  />
                  {professorSubjectRelations.length > PAGE_SIZE && (
                    <Pagination page={profPage} setPage={setProfPage} totalPages={profTotalPages} />
                  )}
                </>
              )}
              {viewRelationType === 'grade-subject' && (
                <>
                  <GradeSubjectRelationsList 
                    relations={getPaginated(gradeSubjectRelations, gradePage)} 
                    onEdit={mode==='editar' ? handleFakeEdit : undefined} 
                  />
                  {gradeSubjectRelations.length > PAGE_SIZE && (
                    <Pagination page={gradePage} setPage={setGradePage} totalPages={gradeTotalPages} />
                  )}
                </>
              )}
              {viewRelationType === 'tutor-student' && (
                <>
                  <TutorStudentRelationsList 
                    relations={getPaginated(tutorStudentRelations, tutorPage)} 
                    onEdit={mode==='editar' ? handleFakeEdit : undefined} 
                  />
                  {tutorStudentRelations.length > PAGE_SIZE && (
                    <Pagination page={tutorPage} setPage={setTutorPage} totalPages={tutorTotalPages} />
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}

      {/* Modal de edición simulado con inputs */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={()=>setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Relación</Text>
            {editItem && (
              <>
                {viewRelationType === 'professor-subject' && (
                  <>
                    <Text style={{fontWeight:'bold'}}>Profesor</Text>
                    <TextInput style={styles.input} value={editItem.profesorNombre} editable={false} />
                    <Text style={{fontWeight:'bold'}}>Materia</Text>
                    <TextInput style={styles.input} value={editItem.materiaNombre} editable={false} />
                    <Text style={{fontWeight:'bold'}}>Turno</Text>
                    <TextInput style={styles.input} value={editItem.turno} />
                    <Text style={{fontWeight:'bold'}}>Año Escolar</Text>
                    <TextInput style={styles.input} value={String(editItem.anioEscolar)} keyboardType="numeric" />
                  </>
                )}
                {viewRelationType === 'grade-subject' && (
                  <>
                    <Text style={{fontWeight:'bold'}}>Grado</Text>
                    <TextInput style={styles.input} value={editItem.gradoNombre} editable={false} />
                    <Text style={{fontWeight:'bold'}}>Materia</Text>
                    <TextInput style={styles.input} value={editItem.materiaNombre} editable={false} />
                    <Text style={{fontWeight:'bold'}}>Semestre</Text>
                    <TextInput style={styles.input} value={String(editItem.semestre)} keyboardType="numeric" />
                  </>
                )}
                {viewRelationType === 'tutor-student' && (
                  <>
                    <Text style={{fontWeight:'bold'}}>Tutor</Text>
                    <TextInput style={styles.input} value={editItem.tutorNombre} editable={false} />
                    <Text style={{fontWeight:'bold'}}>Alumno</Text>
                    <TextInput style={styles.input} value={editItem.alumnoNombre} editable={false} />
                  </>
                )}
              </>
            )}
            <View style={{flexDirection:'row', gap:16, marginTop:16}}>
              <TouchableOpacity style={[styles.button, {flex:1, backgroundColor:'#339999'}]} onPress={()=>{/* conectar a backend aquí */}}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {flex:1, backgroundColor:'#888'}]} onPress={()=>setShowEditModal(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Componente de paginación reutilizable
interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}
const Pagination = ({ page, setPage, totalPages }: PaginationProps) => (
  <View style={styles.paginationContainer}>
    <Text style={styles.paginationText}>Página {page} de {totalPages}</Text>
    <View style={styles.paginationButtons}>
      <Text style={[styles.paginationButton, page===1 && styles.paginationButtonDisabled]} onPress={()=>page>1 && setPage(page-1)}>Anterior</Text>
      <Text style={[styles.paginationButton, page===totalPages && styles.paginationButtonDisabled]} onPress={()=>page<totalPages && setPage(page+1)}>Siguiente</Text>
    </View>
  </View>
);

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
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
  tab: { paddingVertical: 4, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#e0e0e0' },
  tabActive: { backgroundColor: '#339999' },
  tabText: { color: '#222', fontWeight: 'bold', fontSize: 16, paddingVertical: 0, paddingHorizontal: 0 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', borderRadius: 12, padding: 24, width: 320, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  paginationContainer: { alignItems: 'center', marginVertical: 10 },
  paginationText: { fontSize: 14, marginBottom: 4 },
  paginationButtons: { flexDirection: 'row', gap: 20 },
  paginationButton: { color: '#007bff', fontWeight: 'bold', fontSize: 16, paddingHorizontal: 16, paddingVertical: 6 },
  paginationButtonDisabled: { color: '#ccc' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 12,
    fontSize: 16,
  },
});

export default RelationshipScreen;
