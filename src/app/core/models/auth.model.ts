export interface LoginRequest { username: string; password: string; }
export interface LoginData {
  token: string; refreshToken: string; username: string; fullName: string; role: string; userId: string; expiresAt: string;
}
export interface LoginResponse { success: boolean; message: string; data: LoginData; errors?: string[]; }
export interface RegisterRequest {
  username: string; password: string; fullName: string; email?: string; phoneNumber?: string; pcId?: string;
}
