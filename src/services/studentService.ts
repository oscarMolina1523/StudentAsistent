type Student = { id: number; name: string };

const staticData: { [key: number]: Student[] } = {
  1: [{ id: 1, name: 'Juan Perez' }, { id: 2, name: 'Maria Lopez' }],
  2: [{ id: 3, name: 'Carlos Sanchez' }, { id: 4, name: 'Ana Torres' }],
  3: [{ id: 5, name: 'Luis Gomez' }, { id: 6, name: 'Sofia Ramirez' }],
  4: [{ id: 7, name: 'Pedro Diaz' }, { id: 8, name: 'Lucia Fernandez' }],
  5: [{ id: 9, name: 'Jorge Martinez' }, { id: 10, name: 'Elena Suarez' }],
  6: [{ id: 11, name: 'Diego Castro' }, { id: 12, name: 'Valeria Morales' }],
};

export const getStudentsByGrade = (gradeId: number): Student[] => {
  return staticData[gradeId] || [];
};
