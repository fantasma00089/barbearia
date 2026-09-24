export type AppErrorCode =
  | "NOT_FOUND"
  | "CONFLICT"
  | "POLICY"
  | "VALIDATION"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "UNAVAILABLE";

const STATUS: Record<AppErrorCode, number> = {
  NOT_FOUND: 404,
  CONFLICT: 409,
  POLICY: 422,
  VALIDATION: 400,
  RATE_LIMITED: 429,
  UNAUTHORIZED: 401,
  UNAVAILABLE: 503,
};

/** Erro de domínio com mensagem segura para exibir ao usuário. */
export class AppError extends Error {
  readonly status: number;
  constructor(
    readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
    this.status = STATUS[code];
  }
}
