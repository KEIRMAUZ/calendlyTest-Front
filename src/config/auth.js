import { useState, useEffect } from 'react';

// Configuración de autenticación para el frontend
export const AUTH_CONFIG = {
  // URL base del backend
  BACKEND_URL: 'http://localhost:3000',
  
  // Endpoints de autenticación
  ENDPOINTS: {
    GOOGLE_AUTH: '/auth/google',
    STATUS: '/auth/status',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  
  // Configuración de cookies
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: false, // Cambiar a true en producción
    sameSite: 'lax',
  },
};

// Función para verificar el estado de autenticación
export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${AUTH_CONFIG.BACKEND_URL}${AUTH_CONFIG.ENDPOINTS.STATUS}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    return { authenticated: false };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { authenticated: false };
  }
};

// Función para iniciar autenticación con Google
export const initiateGoogleAuth = () => {
  window.location.href = `${AUTH_CONFIG.BACKEND_URL}${AUTH_CONFIG.ENDPOINTS.GOOGLE_AUTH}`;
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    const response = await fetch(`${AUTH_CONFIG.BACKEND_URL}${AUTH_CONFIG.ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'Logged out successfully' };
    }
    
    return { success: false, message: 'Error logging out' };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, message: error.message };
  }
};

// Función para obtener el perfil del usuario
export const getProfile = async () => {
  try {
    const response = await fetch(`${AUTH_CONFIG.BACKEND_URL}${AUTH_CONFIG.ENDPOINTS.PROFILE}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

// Hook personalizado para manejar la autenticación
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const status = await checkAuthStatus();
      
      if (status.authenticated && status.user) {
        setUser(status.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    initiateGoogleAuth();
  };

  const logoutUser = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setUser(null);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout: logoutUser,
    checkAuth,
  };
}; 