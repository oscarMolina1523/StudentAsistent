export class ProfessorSubject {
  constructor(
    private _id: string,
    private _materiaGradoId: string,
    private _anioEscolar: number,
    private _profesorId: string,
    private _turno: string
  ) {}

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get materiaGradoId(): string {
    return this._materiaGradoId;
  }
  set materiaGradoId(value: string) {
    this._materiaGradoId = value;
  }

  get anioEscolar(): number {
    return this._anioEscolar;
  }
  set anioEscolar(value: number) {
    this._anioEscolar = value;
  }

  get profesorId(): string {
    return this._profesorId;
  }
  set profesorId(value: string) {
    this._profesorId = value;
  }

  get turno(): string {
    return this._turno;
  }
  set turno(value: string) {
    this._turno = value;
  }
}
