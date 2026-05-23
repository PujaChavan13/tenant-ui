/**
 * Admin user returned from your login API (fields may vary — normalize in authService).
 */
export type AdminUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
