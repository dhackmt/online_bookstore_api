import { timeStamp } from "console";
import winston from "winston";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

interface LogParams {
  message: string;
  error?: Error;
  context?: Record<string, any>;
}

type LogLevel = "error" | "info" | "warn" | "debug";
export class Logger {
  private logger: winston.Logger;
  private readonly dataDogApiUrl = process.env.DATADOG_API_URL || "";
  private readonly dataDogApiKey = process.env.DATADOG_API_KEY || "";

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    });
  }

  private async sendToDatadog(
    level: LogLevel,
    message: string,
    context: Record<string, any> = {}
  ) {
    try {
      await axios.post(
        this.dataDogApiUrl,
        {
          ddSource: "nodejs",
          service: "assignment-6",
          hostname: "local",
          status: level,
          message,
          context,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "DD-API-KEY": this.dataDogApiKey,
          },
        }
      );
    } catch (error: any) {
      console.log(error.message);
    }
  }

  public async log(
    level: "info" | "error" | "warn" | "debug",
    { message, error, context = {} }: LogParams
  ) {
    const logContext = {
      error: error instanceof Error ? error.stack : error,
      timeStamp: new Date().toISOString,
      ...context,
    };
    this.logger.log(level, message, logContext);
    await this.sendToDatadog(level, message, context);
  }

  public async info(params: LogParams) {
    await this.log("info", params);
  }
  public async warn(params: LogParams) {
    await this.log("warn", params);
  }
  public async debug(params: LogParams) {
    await this.log("debug", params);
  }
  public async error(params: LogParams) {
    await this.log("error", params);
  }
}
