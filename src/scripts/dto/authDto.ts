export interface AuthDto {
  user_name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}
