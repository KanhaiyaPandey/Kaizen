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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof AppError) {
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      details: serializeError(error.details)
    };
  }

  if (error instanceof Error) {
    const serialized: Record<string, unknown> = {
      name: error.name,
      message: error.message
    };

    const withKnownFields = error as Error & {
      status?: number;
      code?: string;
      type?: string;
      request_id?: string;
      param?: string;
      headers?: Record<string, unknown>;
      error?: unknown;
      cause?: unknown;
    };

    if (withKnownFields.status) {
      serialized.status = withKnownFields.status;
    }

    if (withKnownFields.code) {
      serialized.code = withKnownFields.code;
    }

    if (withKnownFields.type) {
      serialized.type = withKnownFields.type;
    }

    if (withKnownFields.request_id) {
      serialized.requestId = withKnownFields.request_id;
    }

    if (withKnownFields.param) {
      serialized.param = withKnownFields.param;
    }

    if (withKnownFields.error) {
      serialized.error = serializeError(withKnownFields.error);
    }

    if (withKnownFields.cause) {
      serialized.cause = serializeError(withKnownFields.cause);
    }

    return serialized;
  }

  if (Array.isArray(error)) {
    return { items: error.map((item) => serializeError(item)) };
  }

  if (isRecord(error)) {
    const serializedEntries = Object.entries(error).slice(0, 20).map(([key, value]) => [
      key,
      isRecord(value) || Array.isArray(value) || value instanceof Error ? serializeError(value) : value
    ]);

    return Object.fromEntries(serializedEntries);
  }

  return {
    value: String(error)
  };
}

export function toAppError(error: unknown, fallbackMessage: string) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(fallbackMessage, 500, error);
}
