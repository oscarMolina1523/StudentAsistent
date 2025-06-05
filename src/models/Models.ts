export interface Subject {
  id: string;
  nombre: string;
  imagenUrl: string;
}

export interface ProfessorSubject {
  id: string;
  materiaGradoId: string;
  anioEscolar: number;
  profesorId: string;
  turno: string;
}

export interface Grade {
  id: string;
  nombre: string;
  descripcion: string;
  turno: string;
  imagenUrl: string;
}


export type AttendanceData = {
  alumnoId: string;
  materiaId: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'justificado';
  justificacion?: string;
  registradoPor: string;
  horaRegistro: string;
};

export type AttendanceSummary = {
  id: string;
  alumnoId: string;
  nombreAlumno: string;
  gradoId: string;
  materiaId: string;
  nombreMateria: string;
  estado: 'presente' | 'ausente' | 'justificado';
  fecha: string;
  justificacion: string;
};

export interface TutorStudentRelation {
  id: string;
  alumnoId: string;
  tutorId: string;
}

export interface Student {
  id: string;
  nombre: string;
  apellido: string;
  gender: string;
  gradoId: string;
  turno: string;
  fechaNacimiento: string;
  activo: boolean;
}
