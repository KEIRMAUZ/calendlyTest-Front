import React, { useState, useEffect } from 'react';
import { api } from '../config/api.js';
import { checkAuthStatus, initiateGoogleAuth, logout } from '../config/auth.js';

const BackendTest = () => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState(null);

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const authStatus = await checkAuthStatus();
        
        if (authStatus.authenticated && authStatus.user) {
          setUser(authStatus.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log('Usuario no autenticado');
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Verificar parámetros de URL después de autenticación
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const message = urlParams.get('message');

    if (success === 'true') {
      setAuthMessage({ type: 'success', text: '¡Autenticación exitosa! Redirigiendo...' });
      // Limpiar parámetros de URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Recargar estado de autenticación
      setTimeout(() => {
        checkAuthStatus().then(authStatus => {
          if (authStatus.authenticated && authStatus.user) {
            setUser(authStatus.user);
            setAuthMessage(null);
          }
        });
      }, 1000);
    } else if (error) {
      setAuthMessage({ 
        type: 'error', 
        text: `Error de autenticación: ${message || error}` 
      });
      // Limpiar parámetros de URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Función para probar la conexión con el backend
  const testBackendConnection = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  // Función para iniciar autenticación con Google
  const handleGoogleAuth = async () => {
    setStatus('loading');
    setError(null);
    setAuthMessage(null);
    
    try {
      initiateGoogleAuth();
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  // Función para probar autenticación
  const testAuth = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const result = await api.auth.google();
      setData(result);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  // Función para probar Calendly
  const testCalendly = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const result = await api.calendly.getEvents();
      setData(result);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const result = await logout();
      
      if (result.success) {
        setUser(null);
        setData(null);
        setStatus('success');
        setAuthMessage({ type: 'success', text: 'Sesión cerrada exitosamente' });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="container fade-in">
      <div className="header">
        <h1>🧪 Prueba de Conexión con Backend</h1>
        <p>Conecta tu aplicación React con el backend NestJS</p>
      </div>

      {/* Mensaje de autenticación */}
      {authMessage && (
        <div className={`${authMessage.type === 'success' ? 'success-message' : 'error-message'}`}>
          <strong>{authMessage.type === 'success' ? '✅ Éxito:' : '❌ Error:'}</strong> {authMessage.text}
        </div>
      )}

      <div className="card">
        <h2>🔗 Estado de Conexión</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p>
            <strong>Backend:</strong> http://localhost:3000<br />
            <strong>Frontend:</strong> http://localhost:5173
          </p>
        </div>

        <div className="button-group">
          <button 
            onClick={testBackendConnection}
            disabled={status === 'loading'}
            className="button"
          >
            {status === 'loading' ? (
              <>
                <span className="loading-spinner"></span>
                Probando...
              </>
            ) : (
              '🔗 Probar Conexión'
            )}
          </button>

          <button 
            onClick={testAuth}
            disabled={status === 'loading'}
            className="button secondary"
          >
            🔐 Probar Auth
          </button>

          <button 
            onClick={testCalendly}
            disabled={status === 'loading'}
            className="button warning"
          >
            📅 Probar Calendly
          </button>
        </div>

        {/* Mostrar estado */}
        <div style={{ marginBottom: '20px' }}>
          <strong>Estado:</strong> 
          <span className={`status-badge ${status}`}>
            {status === 'success' ? '✅ Éxito' :
             status === 'error' ? '❌ Error' :
             status === 'loading' ? '⏳ Cargando...' : '⏸️ Inactivo'}
          </span>
        </div>

        {/* Mostrar error */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Mostrar datos */}
        {data && (
          <div className="response-data">
            <strong>Respuesta del Backend:</strong>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Sección de autenticación con Google */}
      <div className="card">
        <h2>🔐 Autenticación con Google</h2>
        
        {authLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <span className="loading-spinner"></span>
            <p>Verificando estado de autenticación...</p>
          </div>
        ) : user ? (
          <div className="success-message">
            <h3>✅ Usuario Autenticado</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    border: '2px solid var(--success-color)'
                  }} 
                />
              )}
              <div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nombre:</strong> {user.name}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="button danger">
              🚪 Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="google-auth-section">
            <h3>🔑 Iniciar Sesión con Google</h3>
            <p>Haz clic en el botón para autenticarte con tu cuenta de Google</p>
            
            <button 
              onClick={handleGoogleAuth}
              disabled={status === 'loading'}
              className="google-button"
            >
              {status === 'loading' ? (
                <>
                  <span className="loading-spinner"></span>
                  Conectando...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Iniciar Sesión con Google
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="instructions">
        <h4>📋 Instrucciones:</h4>
        <ol>
          <li>Asegúrate de que el backend esté corriendo en el puerto 3000</li>
          <li>Ejecuta <code>npm run start:dev</code> en la carpeta Calendly</li>
          <li>Ejecuta <code>npm run dev</code> en la carpeta test</li>
          <li>Usa los botones arriba para probar la conexión</li>
          <li>Para autenticarte con Google, haz clic en el botón correspondiente</li>
          <li>Después de la autenticación, serás redirigido de vuelta al frontend</li>
        </ol>
      </div>
    </div>
  );
};

export default BackendTest; 