import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let { message }: any = exception.getResponse();
    message = typeof message === 'object' ? message[0] : message;
    return res.status(status).json({
      success: false,
      message:
        status === 401
          ? 'Unauthorized.'
          : message == 'jwt expired'
            ? 'Session expired.'
            : message,
    });
  }
}
