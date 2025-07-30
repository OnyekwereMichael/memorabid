// API service for authentication endpoints

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'seller' | 'user';
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      phone: string;
    };
    token?: string;
  };
  errors?: Record<string, string[]>;
}

const API_BASE_URL = 'https://ecc.lafmax.com/api';

export const authAPI = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Registration failed',
          errors: result.errors || {},
        };
      }

      return {
        success: true,
        message: result.message || 'Registration successful',
        data: result.data,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },
}; 