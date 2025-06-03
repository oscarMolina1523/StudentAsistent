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