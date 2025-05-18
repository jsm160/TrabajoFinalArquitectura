export interface LoginForm {
    email: string;
    password: string;
  }
  
  export interface AuthResponse { // Para la respuesta del backend
    token: string;
    userId?: string; // Opcional, depende de tu backend
    // otros datos que pueda devolver el backend
  }