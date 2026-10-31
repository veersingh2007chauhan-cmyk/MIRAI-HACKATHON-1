type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isProduction = process.env.NODE_ENV === "production";

  private format(level: LogLevel, payload: LogPayload): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${payload.message}`;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.isProduction) {
      const formatted = this.format("debug", { message, context });
      process.stdout.write(`${formatted}\n`);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const formatted = this.format("info", { message, context });
    process.stdout.write(`${formatted}\n`);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const formatted = this.format("warn", { message, context });
    process.stderr.write(`${formatted}\n`);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const formatted = this.format("error", { message, error, context });
    process.stderr.write(`${formatted} ${error ? error.stack ?? error.message : ""}\n`);
  }
}

export const logger = new Logger();

