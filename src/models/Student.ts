export class Student {
  constructor(
    private _id: string,
    private _nombre: string,
    private _apellido: string,
    private _gender: string,
    private _gradoId: string,
    private _turno: string,
    private _fechaNacimiento: string,
    private _activo: boolean
  ) {}

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get nombre(): string {
    return this._nombre;
  }
  set nombre(value: string) {
    this._nombre = value;
  }

  get apellido(): string {
    return this._apellido;
  }
  set apellido(value: string) {
    this._apellido = value;
  }

  get gender(): string {
    return this._gender;
  }
  set gender(value: string) {
    this._gender = value;
  }

  get gradoId(): string {
    return this._gradoId;
  }
  set gradoId(value: string) {
    this._gradoId = value;
  }

  get turno(): string {
    return this._turno;
  }
  set turno(value: string) {
    this._turno = value;
  }

  get fechaNacimiento(): string {
    return this._fechaNacimiento;
  }
  set fechaNacimiento(value: string) {
    this._fechaNacimiento = value;
  }

  get activo(): boolean {
    return this._activo;
  }
  set activo(value: boolean) {
    this._activo = value;
  }
}
