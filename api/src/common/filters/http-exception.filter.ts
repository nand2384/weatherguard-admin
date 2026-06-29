import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;
    const message = this.getMessage(exceptionResponse, exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} failed`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error:
        exceptionResponse && typeof exceptionResponse === 'object'
          ? (exceptionResponse as { error?: string }).error
          : undefined,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getMessage(response: unknown, exception: unknown) {
    if (response && typeof response === 'object' && 'message' in response) {
      return (response as { message: string | string[] }).message;
    }

    if (typeof response === 'string') {
      return response;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
