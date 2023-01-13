import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();

    const httpStatusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
      message:
        exception instanceof HttpException
          ? exception.getResponse()['message'] || exception.message
          : exception instanceof ThrottlerException
          ? 'too many requests made to this endpoint, are you a bot?'
          : 'something terrible went wrong.',
    };
    this.configService.get('APP_MODE') === 'development' &&
      console.error(exception);
    httpAdapter.reply(context.getResponse(), responseBody, httpStatusCode);
  }
}
