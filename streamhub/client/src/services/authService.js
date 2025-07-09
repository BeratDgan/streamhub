import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.token = null;
    this.loadTokenFromStorage();
    this.setupInterceptors();
  }

  loadTokenFromStorage() {
    // Use sessionStorage for better security (clears on browser close)
    this.token = sessionStorage.getItem('authToken');
  }

  setupInterceptors() {
    // Request interceptor to add token to headers
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      console.log('Attempting login with:', { email }); // Debug log
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      console.log('Login successful:', { user }); // Debug log
      this.setToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      }); // Enhanced debug log
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          `Login failed: ${error.response?.status || 'Network error'}`;
      throw new Error(errorMessage);
    }
  }

  async register(username, email, password, isStreamer) {
    try {
      console.log('Attempting registration with:', { username, email, isStreamer }); // Debug log
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        isStreamer
      });

      console.log('Registration response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      }); // Enhanced debug log
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          `Registration failed: ${error.response?.status || 'Network error'}`;
      throw new Error(errorMessage);
    }
  }

  logout() {
    this.token = null;
    sessionStorage.removeItem('authToken');
  }

  setToken(token) {
    this.token = token;
    sessionStorage.setItem('authToken', token);
  }

  getToken() {
    // First check memory, then sessionStorage
    if (this.token) {
      return this.token;
    }
    
    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      this.token = storedToken;
      return storedToken;
    }
    
    return null;
  }

  getUserFromToken(token) {
    try {
      // Decode JWT payload (simple base64 decode for payload part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        return null;
      }

      return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        isStreamer: payload.isStreamer
      };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
