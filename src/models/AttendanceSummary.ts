export class AttendanceSummary {
  constructor(
    private _id: string,
    private _alumnoId: string,
    private _nombreAlumno: string,
    private _gradoId: string,
    private _materiaId: string,
    private _nombreMateria: string,
    private _estado: 'presente' | 'ausente' | 'justificado',
    private _fecha: string,
    private _justificacion: string
  ) {}

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get alumnoId(): string {
    return this._alumnoId;
  }
  set alumnoId(value: string) {
    this._alumnoId = value;
  }

  get nombreAlumno(): string {
    return this._nombreAlumno;
  }
  set nombreAlumno(value: string) {
    this._nombreAlumno = value;
  }

  get gradoId(): string {
    return this._gradoId;
  }
  set gradoId(value: string) {
    this._gradoId = value;
  }

  get materiaId(): string {
    return this._materiaId;
  }
  set materiaId(value: string) {
    this._materiaId = value;
  }

  get nombreMateria(): string {
    return this._nombreMateria;
  }
  set nombreMateria(value: string) {
    this._nombreMateria = value;
  }

  get estado(): 'presente' | 'ausente' | 'justificado' {
    return this._estado;
  }
  set estado(value: 'presente' | 'ausente' | 'justificado') {
    this._estado = value;
  }

  get fecha(): string {
    return this._fecha;
  }
  set fecha(value: string) {
    this._fecha = value;
  }

  get justificacion(): string {
    return this._justificacion;
  }
  set justificacion(value: string) {
    this._justificacion = value;
  }
}
