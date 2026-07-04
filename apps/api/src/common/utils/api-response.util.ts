import type { ApiResponse } from '@ultron/shared';

export function createApiResponse<T>(
  data: T,
  meta?: ApiResponse<T>['meta'],
): ApiResponse<T> {
  return {
    data,
    ...(meta !== undefined ? { meta } : {}),
    timestamp: new Date().toISOString(),
  };
}
