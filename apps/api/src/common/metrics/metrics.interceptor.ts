import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const started = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => {
          this.record(request, response.statusCode, started);
        },
        error: () => {
          this.record(request, response.statusCode || 500, started);
        },
      }),
    );
  }

  private record(request: Request, statusCode: number, started: bigint): void {
    const routePath = this.resolveRoutePath(request);
    const labels = {
      method: request.method,
      route: routePath,
      status_code: String(statusCode),
    };

    const durationSeconds =
      Number(process.hrtime.bigint() - started) / 1_000_000_000;
    this.metricsService.httpRequestsTotal.inc(labels);
    this.metricsService.httpRequestDuration.observe(labels, durationSeconds);
  }

  private resolveRoutePath(request: Request): string {
    const route = request.route as { path?: string } | undefined;
    if (route?.path !== undefined) {
      return route.path;
    }
    return request.path;
  }
}
