export class ApiError extends Error {
  data: any;
  success: boolean;
  constructor(
    public statusCode: number,
    message: string,
    
  ) {
    super(message);
    this.success = false;
    this.data = null;    
    this.name = new.target.name;
    Error.captureStackTrace(this, this.constructor);
  }
}



