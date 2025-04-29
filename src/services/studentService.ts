type Student = { id: number; name: string };

const staticData: { [key: number]: Student[] } = {
  1: [
    { id: 1, name: 'Juan Perez' },
    { id: 2, name: 'Maria Lopez' },
    { id: 3, name: 'Luis Vargas' },
    { id: 4, name: 'Camila Soto' },
    { id: 5, name: 'Mateo Rojas' },
    { id: 6, name: 'Isabella Peña' },
    { id: 7, name: 'Sebastián Lara' },
    { id: 8, name: 'Emma Reyes' },
    { id: 9, name: 'Tomás Díaz' },
    { id: 10, name: 'Sara Medina' }
  ],
  2: [
    { id: 11, name: 'Carlos Sanchez' },
    { id: 12, name: 'Ana Torres' },
    { id: 13, name: 'Valentina Herrera' },
    { id: 14, name: 'Andrés Ruiz' },
    { id: 15, name: 'Daniela Paredes' },
    { id: 16, name: 'Diego Molina' },
    { id: 17, name: 'Nicole Castro' },
    { id: 18, name: 'Samuel Ortega' },
    { id: 19, name: 'Jazmín Salazar' },
    { id: 20, name: 'Alan Cordero' }
  ],
  3: [
    { id: 21, name: 'Luis Gomez' },
    { id: 22, name: 'Sofia Ramirez' },
    { id: 23, name: 'Gabriel Núñez' },
    { id: 24, name: 'Renata Vargas' },
    { id: 25, name: 'Julián Silva' },
    { id: 26, name: 'Laura Cabrera' },
    { id: 27, name: 'David León' },
    { id: 28, name: 'Paula Rivas' },
    { id: 29, name: 'Bruno Pino' },
    { id: 30, name: 'Florencia Arias' }
  ],
  4: [
    { id: 31, name: 'Pedro Diaz' },
    { id: 32, name: 'Lucia Fernandez' },
    { id: 33, name: 'Marcos Aguirre' },
    { id: 34, name: 'Zoe Navarro' },
    { id: 35, name: 'Ricardo Muñoz' },
    { id: 36, name: 'Daniela Torres' },
    { id: 37, name: 'Martín Calderón' },
    { id: 38, name: 'Julieta Vega' },
    { id: 39, name: 'Esteban Rojas' },
    { id: 40, name: 'Angela Castillo' }
  ],
  5: [
    { id: 41, name: 'Jorge Martinez' },
    { id: 42, name: 'Elena Suarez' },
    { id: 43, name: 'Iván Mendoza' },
    { id: 44, name: 'Camila Lozano' },
    { id: 45, name: 'Cristian Torres' },
    { id: 46, name: 'Allison Ramos' },
    { id: 47, name: 'Francisco Soto' },
    { id: 48, name: 'Bianca Castaño' },
    { id: 49, name: 'Erick Ayala' },
    { id: 50, name: 'Daniela Jiménez' }
  ],
  6: [
    { id: 51, name: 'Diego Castro' },
    { id: 52, name: 'Valeria Morales' },
    { id: 53, name: 'Leonardo Paredes' },
    { id: 54, name: 'Mía González' },
    { id: 55, name: 'Alexis Villalobos' },
    { id: 56, name: 'Carla Espinoza' },
    { id: 57, name: 'Adrián Ríos' },
    { id: 58, name: 'Fernanda Díaz' },
    { id: 59, name: 'Santiago Mejía' },
    { id: 60, name: 'Natalia Salinas' }
  ]
};


export const getStudentsByGrade = (gradeId: number): Student[] => {
  return staticData[gradeId] || [];
};
