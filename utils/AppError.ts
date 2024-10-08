export default class AppError extends Error {
  constructor(msg: string) {
    super(msg);
    console.log(this.message);
  }
}
