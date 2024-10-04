export interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type SignInFormData = Pick<SignUpFormData, 'email' | 'password'>;
