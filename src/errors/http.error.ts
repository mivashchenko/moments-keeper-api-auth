class HttpError extends Error {
  public statusCode: number;

  public type: string;

  constructor(message: string, statusCode = 500, type = 'system-error') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export default HttpError;
