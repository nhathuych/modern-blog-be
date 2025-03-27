import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const { statusCode } = context.switchToHttp().getResponse();

    if (context.getType().toString() !== 'graphql') {
      const { method, originalUrl, body } = context.switchToHttp().getRequest();

      console.log(`[${method}] "${originalUrl}" at ${new Date().toLocaleString()}`);
      if (this.isBodyNotBlank(body)) console.log('Body:', body);
    } else {
      const gqlCtx = context.getArgByIndex(3);
      console.log(`[GraphQL] [${gqlCtx.operation.operation}] -> "${gqlCtx.fieldName}" at ${new Date().toLocaleString()}`);
    }

    return next.handle().pipe(
      tap(() => {
        console.log(`[${statusCode || 'GraphQL'}] Completed in ${Date.now() - now}ms\n`);
      }),
    );
  }

  private isBodyNotBlank(body) {
    return body && Object.keys(body).length > 0;
  }
}
