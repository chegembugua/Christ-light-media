export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}
