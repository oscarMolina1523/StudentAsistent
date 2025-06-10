export class Grade {
  constructor(
    private _id: string,
    private _nombre: string,
    private _descripcion: string,
    private _turno: string,
    private _imagenUrl: string
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

  get descripcion(): string {
    return this._descripcion;
  }
  set descripcion(value: string) {
    this._descripcion = value;
  }

  get turno(): string {
    return this._turno;
  }
  set turno(value: string) {
    this._turno = value;
  }

  get imagenUrl(): string {
    return this._imagenUrl;
  }
  set imagenUrl(value: string) {
    this._imagenUrl = value;
  }
}
