import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const { method, originalUrl, body } = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();

    console.log(`\n[${method}] "${originalUrl}" at ${this.datetimeRequest()}`);
    if (this.isBodyNotBlank(body)) console.log('Body:', body);

    return next.handle().pipe(
      tap(() => {
        console.log(`[${statusCode}] Completed in ${Date.now() - now}ms`);
      }),
    );
  }

  datetimeRequest() {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(date);

    return `${formattedDate}, ${formattedTime}`;
  }

  isBodyNotBlank(body) {
    return body && Object.keys(body).length > 0;
  }
}
