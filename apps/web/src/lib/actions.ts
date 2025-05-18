import { createSafeActionClient } from "next-safe-action";

export class ServerActionError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ServerActionError";
  }
}

export const action = createSafeActionClient({
  throwValidationErrors: true,
  handleServerError: (error: unknown) => {
    // Logamos o erro no console para debug
    console.error("Server Action Error:", error);

    // Formatamos o erro para o cliente de forma mais controlada
    if (error instanceof ServerActionError) {
      return new ServerActionError(
        error.message,
        error.statusCode,
        error.fieldErrors
      );
    }

    // Para erros genéricos
    return new ServerActionError(
      error instanceof Error ? error.message : "Erro inesperado no servidor",
      500
    );
  },
});
