export interface LoginRequest { username: string; password: string; }
export interface LoginData {
  token: string; refreshToken: string; username: string; fullName: string; role: string; userId: string; expiresAt: string;
}
export interface LoginResponse { success: boolean; message: string; data: LoginData; errors?: string[]; }
export interface RegisterRequest {
  username: string; password: string; fullName: string; email?: string; phoneNumber?: string; pcId?: string;
}
<<<<<<< HEAD
=======

export interface LoginResponse {
  token: string;
  expiresAt: string;
  username: string;
  fullName: string;
  role: string;
}
>>>>>>> 5149b2c6453205bb16ba4ac8b50d65beef032793
