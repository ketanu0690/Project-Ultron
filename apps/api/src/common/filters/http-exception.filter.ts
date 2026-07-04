import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { ApiError } from '@ultron/shared';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const apiError: ApiError = {
      statusCode: status,
      message: this.extractMessage(exceptionResponse),
      errors: this.extractFieldErrors(exceptionResponse),
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(apiError);
  }

  private extractMessage(response: string | object): string {
    if (typeof response === 'string') {
      return response;
    }

    if ('message' in response) {
      const message = (response as { message: string | string[] }).message;
      if (Array.isArray(message)) {
        return message[0] ?? 'Validation failed';
      }
      return message;
    }

    return 'An error occurred';
  }

  private extractFieldErrors(
    response: string | object,
  ): ApiError['errors'] | undefined {
    if (
      typeof response !== 'object' ||
      response === null ||
      !('message' in response)
    ) {
      return undefined;
    }

    const message = (response as { message: string | string[] }).message;
    if (!Array.isArray(message)) {
      return undefined;
    }

    return message.map((entry) => ({
      field: 'unknown',
      message: entry,
    }));
  }
}
