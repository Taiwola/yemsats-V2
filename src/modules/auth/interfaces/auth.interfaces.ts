export interface SignInInterface {
  password: string;
  email: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

export interface JwtPayLoad {
  email: string;
  id: string;
  exp: number;
  iat: number;
}

export interface UserReq {
  email: string;
  id: string;
  exp: number;
  iat: number;
}
