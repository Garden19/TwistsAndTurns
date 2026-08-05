export interface RegisterResponse {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}