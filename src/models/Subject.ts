export class Subject {
  constructor(
    private _id: string,
    private _nombre: string,
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

  get imagenUrl(): string {
    return this._imagenUrl;
  }
  set imagenUrl(value: string) {
    this._imagenUrl = value;
  }
}
