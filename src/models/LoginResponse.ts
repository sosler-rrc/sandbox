export interface LoginResponse<T> {
  success: boolean
  message: string,
  user: T | undefined
}