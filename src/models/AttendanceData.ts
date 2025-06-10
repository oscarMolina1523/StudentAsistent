export class AttendanceData {
  constructor(
    private _alumnoId: string,
    private _materiaId: string,
    private _fecha: string,
    private _estado: 'presente' | 'ausente' | 'justificado',
    private _registradoPor: string,
    private _horaRegistro: string,
    private _justificacion?: string
  ) {}

  get alumnoId(): string {
    return this._alumnoId;
  }
  set alumnoId(value: string) {
    this._alumnoId = value;
  }

  get materiaId(): string {
    return this._materiaId;
  }
  set materiaId(value: string) {
    this._materiaId = value;
  }

  get fecha(): string {
    return this._fecha;
  }
  set fecha(value: string) {
    this._fecha = value;
  }

  get estado(): 'presente' | 'ausente' | 'justificado' {
    return this._estado;
  }
  set estado(value: 'presente' | 'ausente' | 'justificado') {
    this._estado = value;
  }

  get registradoPor(): string {
    return this._registradoPor;
  }
  set registradoPor(value: string) {
    this._registradoPor = value;
  }

  get horaRegistro(): string {
    return this._horaRegistro;
  }
  set horaRegistro(value: string) {
    this._horaRegistro = value;
  }

  get justificacion(): string | undefined {
    return this._justificacion;
  }
  set justificacion(value: string | undefined) {
    this._justificacion = value;
  }
}
