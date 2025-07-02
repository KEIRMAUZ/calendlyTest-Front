import React, { useState, useEffect } from 'react';
import { api } from '../config/api.js';
import { checkAuthStatus, initiateGoogleAuth } from '../config/auth.js';

const CalendlyTest = () => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('auth');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Función para probar autenticación JWT
  const testAuth = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/calendly/test-auth', {
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

  // Función para probar eventos de Calendly
  const testEvents = async () => {
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

  // Función para obtener estadísticas
  const testStats = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/calendly/stats', {
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

  // Función para obtener tipos de eventos
  const testEventTypes = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/calendly/event-types', {
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

  // Función para crear un evento de prueba
  const createTestEvent = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const eventData = {
        title: 'Evento de Prueba',
        description: 'Este es un evento de prueba creado desde el frontend',
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Mañana + 1 hora
        invitee: {
          name: 'Usuario de Prueba',
          email: 'test@example.com'
        }
      };

      const response = await fetch('http://localhost:3000/calendly/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
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

  // Función para limpiar datos
  const clearData = () => {
    setData(null);
    setError(null);
    setStatus('idle');
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString; // Si no se puede parsear, devolver el string original
    }
  };

  // Obtener color de estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success-color)';
      case 'cancelled': return 'var(--error-color)';
      case 'pending': return 'var(--warning-color)';
      default: return 'var(--text-secondary)';
    }
  };

  // Si está cargando la autenticación, mostrar spinner
  if (authLoading) {
    return (
      <div className="container fade-in">
        <div className="header">
          <h1>📅 Prueba de Calendly</h1>
          <p>Verificando autenticación...</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <span className="loading-spinner" style={{ fontSize: '2rem' }}></span>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje de autenticación
  if (!user) {
    return (
      <div className="container fade-in">
        <div className="header">
          <h1>📅 Prueba de Calendly</h1>
          <p>Gestiona eventos y estadísticas de Calendly</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            backgroundColor: '#fef3c7', 
            border: '1px solid #f59e0b', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#d97706', marginTop: 0 }}>🔐 Autenticación Requerida</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              Para usar las funcionalidades de Calendly, primero debes iniciar sesión con Google OAuth.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Los endpoints de Calendly requieren autenticación JWT válida.
            </p>
          </div>

          <button 
            onClick={initiateGoogleAuth}
            className="button"
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            🔐 Iniciar Sesión con Google
          </button>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'var(--background-color)', 
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <h4>📋 Pasos para usar Calendly:</h4>
            <ol style={{ marginLeft: '1rem' }}>
              <li><strong>Inicia sesión</strong> con Google OAuth usando el botón de arriba</li>
              <li><strong>Configura Calendly</strong> en el backend (variables de entorno)</li>
              <li><strong>Obtén un token de acceso</strong> de Calendly</li>
              <li><strong>Prueba las funcionalidades</strong> una vez autenticado</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="header">
        <h1>📅 Prueba de Calendly</h1>
        <p>Gestiona eventos y estadísticas de Calendly</p>
        {user && (
          <div style={{ 
            backgroundColor: 'var(--success-color)', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem',
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}>
            ✅ Autenticado como: {user.name} ({user.email})
          </div>
        )}
      </div>

      {/* Tabs de navegación */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('auth')}
            className={`button ${activeTab === 'auth' ? 'secondary' : ''}`}
            style={{ flex: '1 1 150px' }}
          >
            🔐 Prueba Auth
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`button ${activeTab === 'events' ? 'secondary' : ''}`}
            style={{ flex: '1 1 150px' }}
          >
            📋 Eventos
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`button ${activeTab === 'stats' ? 'secondary' : ''}`}
            style={{ flex: '1 1 150px' }}
          >
            📊 Estadísticas
          </button>
          <button 
            onClick={() => setActiveTab('types')}
            className={`button ${activeTab === 'types' ? 'secondary' : ''}`}
            style={{ flex: '1 1 150px' }}
          >
            🎯 Tipos de Evento
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`button ${activeTab === 'create' ? 'secondary' : ''}`}
            style={{ flex: '1 1 150px' }}
          >
            ➕ Crear Evento
          </button>
        </div>

        {/* Tab de Prueba de Autenticación */}
        {activeTab === 'auth' && (
          <div>
            <h2>🔐 Prueba de Autenticación JWT</h2>
            <p>Verifica que tu token JWT esté funcionando correctamente</p>
            
            <div className="button-group">
              <button 
                onClick={testAuth}
                disabled={status === 'loading'}
                className="button"
              >
                {status === 'loading' ? (
                  <>
                    <span className="loading-spinner"></span>
                    Probando autenticación...
                  </>
                ) : (
                  '🔐 Probar Autenticación JWT'
                )}
              </button>
              
              <button 
                onClick={clearData}
                className="button danger"
              >
                🗑️ Limpiar
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
                {error.includes('401') && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
                    <strong>💡 Solución:</strong>
                    <ol style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                      <li>Verifica que estés autenticado con Google OAuth</li>
                      <li>Si el problema persiste, intenta cerrar sesión y volver a iniciar</li>
                      <li>Verifica que el backend esté ejecutándose en http://localhost:3000</li>
                      <li>Revisa la consola del navegador para más detalles</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Mostrar resultado de autenticación */}
            {data && data.data && (
              <div className="response-data">
                <h3>✅ Autenticación Exitosa</h3>
                
                <div style={{
                  border: '1px solid var(--success-color)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backgroundColor: '#dcfce7',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success-color)' }}>
                    Información del Usuario
                  </h4>
                  
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <div>📧 <strong>Email:</strong> {data.data.userInfo.email}</div>
                    <div>👤 <strong>Nombre:</strong> {data.data.userInfo.name}</div>
                    <div>🆔 <strong>Google ID:</strong> {data.data.userInfo.googleId}</div>
                    <div>🔐 <strong>Estado:</strong> 
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: 'var(--success-color)',
                        color: 'white',
                        textTransform: 'uppercase',
                        marginLeft: '0.5rem'
                      }}>
                        Autenticado
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}>
                    <strong>🎉 ¡Perfecto!</strong> Tu autenticación JWT está funcionando correctamente. 
                    Ahora puedes probar los endpoints de Calendly.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab de Eventos */}
        {activeTab === 'events' && (
          <div>
            <h2>📋 Lista de Eventos</h2>
            <p>Obtén la lista de eventos reales de Calendly</p>
            
            <div className="button-group">
              <button 
                onClick={testEvents}
                disabled={status === 'loading'}
                className="button"
              >
                {status === 'loading' ? (
                  <>
                    <span className="loading-spinner"></span>
                    Cargando eventos...
                  </>
                ) : (
                  '📋 Obtener Eventos'
                )}
              </button>
              
              <button 
                onClick={clearData}
                className="button danger"
              >
                🗑️ Limpiar
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
                {error.includes('401') && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
                    <strong>💡 Solución:</strong>
                    <ol style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                      <li>Verifica que estés autenticado con Google OAuth</li>
                      <li>Si el problema persiste, intenta cerrar sesión y volver a iniciar</li>
                      <li>Configura las credenciales de Calendly en el backend</li>
                    </ol>
                  </div>
                )}
                {error.includes('CALENDLY_ACCESS_TOKEN') && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
                    <strong>💡 Solución:</strong>
                    <ol style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                      <li>Configure las credenciales de Calendly en el archivo <code>.env</code></li>
                      <li>Obtenga un token de acceso visitando: <a href="http://localhost:3000/calendly/connect" target="_blank" style={{ color: 'var(--primary-color)' }}>Conectar con Calendly</a></li>
                      <li>Copie el token y configúrelo como <code>CALENDLY_ACCESS_TOKEN</code> en las variables de entorno</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Mostrar eventos */}
            {data && data.data && data.data.collection && (
              <div className="response-data">
                <h3>📅 Eventos Encontrados ({data.data.collection.length})</h3>
                
                {data.data.summary && (
                  <div style={{ 
                    marginBottom: '1rem', 
                    padding: '1rem', 
                    backgroundColor: 'var(--background-color)', 
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-around',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {data.data.summary.total_events}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Total
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                        {data.data.summary.upcoming_events}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Próximos
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        {data.data.summary.past_events}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Pasados
                      </div>
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                  {data.data.collection.map((event, index) => (
                    <div 
                      key={event.uri || index}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        backgroundColor: 'var(--card-background)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                          {event.event_type?.name || event.name || `Evento ${index + 1}`}
                        </h4>
                        <span 
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            backgroundColor: getStatusColor(event.status),
                            color: 'white',
                            textTransform: 'uppercase'
                          }}
                        >
                          {event.status || 'active'}
                        </span>
                      </div>
                      
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <div>🕐 <strong>Inicio:</strong> {formatDate(event.start_time)}</div>
                        <div>🕐 <strong>Fin:</strong> {formatDate(event.end_time)}</div>
                        {event.created_at && (
                          <div>📅 <strong>Creado:</strong> {formatDate(event.created_at)}</div>
                        )}
                      </div>
                      
                      {event.invitee && (
                        <div style={{ 
                          backgroundColor: 'var(--background-color)', 
                          padding: '0.5rem', 
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}>
                          <strong>👤 Invitado:</strong> {event.invitee.name} ({event.invitee.email})
                        </div>
                      )}
                      
                      {event.uri && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          wordBreak: 'break-all'
                        }}>
                          <strong>🔗 URI:</strong> {event.uri}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab de Estadísticas */}
        {activeTab === 'stats' && (
          <div>
            <h2>📊 Estadísticas de Calendly</h2>
            <p>Obtén estadísticas reales de eventos</p>
            
            <div className="button-group">
              <button 
                onClick={testStats}
                disabled={status === 'loading'}
                className="button"
              >
                {status === 'loading' ? (
                  <>
                    <span className="loading-spinner"></span>
                    Cargando estadísticas...
                  </>
                ) : (
                  '📊 Obtener Estadísticas'
                )}
              </button>
              
              <button 
                onClick={clearData}
                className="button danger"
              >
                🗑️ Limpiar
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

            {/* Mostrar estadísticas */}
            {data && data.data && (
              <div className="response-data">
                <h3>📊 Estadísticas Generales</h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem', 
                  marginTop: '1rem' 
                }}>
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-background)',
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      {data.data.total_events}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Total de Eventos
                    </div>
                  </div>
                  
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-background)',
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                      {data.data.events_this_month}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Este Mes
                    </div>
                  </div>
                  
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-background)',
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                      {data.data.events_this_week}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Esta Semana
                    </div>
                  </div>
                  
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-background)',
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                      {data.data.average_duration}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Duración Promedio
                    </div>
                  </div>
                  
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-background)',
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      {data.data.upcoming_events}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Próximos Eventos
                    </div>
                  </div>
                  
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-background)',
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      {data.data.past_events}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Eventos Pasados
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab de Tipos de Evento */}
        {activeTab === 'types' && (
          <div>
            <h2>🎯 Tipos de Evento</h2>
            <p>Obtén los tipos de eventos configurados en Calendly</p>
            
            <div className="button-group">
              <button 
                onClick={testEventTypes}
                disabled={status === 'loading'}
                className="button"
              >
                {status === 'loading' ? (
                  <>
                    <span className="loading-spinner"></span>
                    Cargando tipos de evento...
                  </>
                ) : (
                  '🎯 Obtener Tipos de Evento'
                )}
              </button>
              
              <button 
                onClick={clearData}
                className="button danger"
              >
                🗑️ Limpiar
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

            {/* Mostrar tipos de evento */}
            {data && data.data && data.data.collection && (
              <div className="response-data">
                <h3>🎯 Tipos de Evento ({data.data.collection.length})</h3>
                
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                  {data.data.collection.map((eventType, index) => (
                    <div 
                      key={eventType.uri || index}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        backgroundColor: 'var(--card-background)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                          {eventType.name || `Tipo de Evento ${index + 1}`}
                        </h4>
                        <span 
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            backgroundColor: eventType.active ? 'var(--success-color)' : 'var(--text-secondary)',
                            color: 'white',
                            textTransform: 'uppercase'
                          }}
                        >
                          {eventType.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {eventType.duration && (
                          <div>⏱️ <strong>Duración:</strong> {eventType.duration} minutos</div>
                        )}
                        {eventType.description && (
                          <div>📝 <strong>Descripción:</strong> {eventType.description}</div>
                        )}
                        {eventType.slug && (
                          <div>🔗 <strong>Slug:</strong> {eventType.slug}</div>
                        )}
                      </div>
                      
                      {eventType.uri && (
                        <div style={{ 
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          wordBreak: 'break-all'
                        }}>
                          <strong>🔗 URI:</strong> {eventType.uri}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab de Crear Evento */}
        {activeTab === 'create' && (
          <div>
            <h2>➕ Crear Nuevo Evento</h2>
            <p>Crea un evento de prueba en Calendly</p>
            
            <div className="button-group">
              <button 
                onClick={createTestEvent}
                disabled={status === 'loading'}
                className="button secondary"
              >
                {status === 'loading' ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creando evento...
                  </>
                ) : (
                  '➕ Crear Evento de Prueba'
                )}
              </button>
              
              <button 
                onClick={clearData}
                className="button danger"
              >
                🗑️ Limpiar
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

            {/* Mostrar evento creado */}
            {data && data.data && (
              <div className="response-data">
                <h3>✅ Evento Creado Exitosamente</h3>
                
                <div style={{
                  border: '1px solid var(--success-color)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backgroundColor: '#dcfce7',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success-color)' }}>
                    {data.data.title}
                  </h4>
                  
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <div>🆔 <strong>ID:</strong> {data.data.id}</div>
                    <div>📝 <strong>Descripción:</strong> {data.data.description}</div>
                    <div>🕐 <strong>Inicio:</strong> {formatDate(data.data.start_time)}</div>
                    <div>🕐 <strong>Fin:</strong> {formatDate(data.data.end_time)}</div>
                    <div>📅 <strong>Creado:</strong> {formatDate(data.data.created_at)}</div>
                    <div>📊 <strong>Estado:</strong> 
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: getStatusColor(data.data.status),
                        color: 'white',
                        textTransform: 'uppercase',
                        marginLeft: '0.5rem'
                      }}>
                        {data.data.status}
                      </span>
                    </div>
                  </div>
                  
                  {data.data.invitee && (
                    <div style={{ 
                      backgroundColor: 'white', 
                      padding: '0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      <strong>👤 Invitado:</strong> {data.data.invitee.name} ({data.data.invitee.email})
                    </div>
                  )}
                  
                  {data.data.uri && (
                    <div style={{ 
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      wordBreak: 'break-all'
                    }}>
                      <strong>🔗 URI:</strong> {data.data.uri}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="instructions">
        <h4>📋 Instrucciones:</h4>
        <ol>
          <li><strong>Eventos:</strong> Obtén la lista de eventos reales de Calendly</li>
          <li><strong>Estadísticas:</strong> Ve estadísticas calculadas de eventos reales</li>
          <li><strong>Tipos de Evento:</strong> Ve los tipos de eventos configurados en Calendly</li>
          <li><strong>Crear Evento:</strong> Crea un evento de prueba (simulado)</li>
          <li><strong>Configuración:</strong> Asegúrate de tener configurado <code>CALENDLY_ACCESS_TOKEN</code> en las variables de entorno</li>
        </ol>
        
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '0.5rem', 
          border: '1px solid #f59e0b' 
        }}>
          <strong>🔧 Configuración de Calendly:</strong>
          <ol style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
            <li>Configure las credenciales de Calendly en el archivo <code>.env</code></li>
            <li>Obtenga un token de acceso visitando: <a href="http://localhost:3000/calendly/connect" target="_blank" style={{ color: 'var(--primary-color)' }}>Conectar con Calendly</a></li>
            <li>Copie el token y configúrelo como <code>CALENDLY_ACCESS_TOKEN</code> en las variables de entorno</li>
            <li>Reinicie el servidor backend</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CalendlyTest; 