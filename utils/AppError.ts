export default class AppError extends Error {
  constructor(msg: string, public statusCode?: number) {
    super(msg);
  }
}
