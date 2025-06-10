export class TutorStudentRelation {
  constructor(
    private _id: string,
    private _alumnoId: string,
    private _tutorId: string
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

  get tutorId(): string {
    return this._tutorId;
  }
  set tutorId(value: string) {
    this._tutorId = value;
  }
}
