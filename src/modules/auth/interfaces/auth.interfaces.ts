export interface SignInInterface {
  password: string;
  email: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

export interface JwtPayLoad {
  email: string;
  exp: number;
  iat: number;
}
