export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function toAppError(error: unknown, fallbackMessage: string) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(fallbackMessage, 500, error);
}
