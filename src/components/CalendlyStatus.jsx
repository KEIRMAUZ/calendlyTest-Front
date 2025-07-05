import React, { useState, useEffect } from 'react';
import { api } from '../config/api';

const CalendlyStatus = () => {
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConfigStatus();
  }, []);

  const loadConfigStatus = async () => {
    try {
      setLoading(true);
      const response = await api.calendly.getConfigStatus();
      setConfigStatus(response.data);
    } catch (error) {
      console.error('Error cargando estado de configuración:', error);
      setError('Error al cargar el estado de configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadConfigStatus();
  };

  if (loading) {
    return (
      <div className="calendly-status">
        <div className="loading-container">
          <span className="spinner">🔄</span>
          <p>Verificando configuración de Calendly...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendly-status">
        <div className="alert error">
          <span>❌ {error}</span>
          <button onClick={handleRefresh} className="retry-button">
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!configStatus) {
    return (
      <div className="calendly-status">
        <div className="alert error">
          <span>❌ No se pudo obtener el estado de configuración</span>
        </div>
      </div>
    );
  }

  const { calendly, user, test_events } = configStatus;

  return (
    <div className="calendly-status">
      <div className="status-header">
        <h3>🔧 Estado de Configuración de Calendly</h3>
        <button onClick={handleRefresh} className="refresh-button">
          🔄 Actualizar
        </button>
      </div>

      <div className="status-grid">
        <div className="status-card">
          <h4>👤 Usuario Autenticado</h4>
          <div className="status-details">
            <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
            <p><strong>Nombre:</strong> {user.name || 'No disponible'}</p>
          </div>
        </div>

        <div className="status-card">
          <h4>🔑 Configuración de Calendly</h4>
          <div className="status-details">
            <div className="status-item">
              <span className={`status-indicator ${calendly.access_token === 'Configurado' ? 'success' : 'error'}`}>
                {calendly.access_token === 'Configurado' ? '✅' : '❌'}
              </span>
              <span>Token de Acceso: {calendly.access_token}</span>
            </div>
            <div className="status-item">
              <span className={`status-indicator ${calendly.client_id === 'Configurado' ? 'success' : 'error'}`}>
                {calendly.client_id === 'Configurado' ? '✅' : '❌'}
              </span>
              <span>Client ID: {calendly.client_id}</span>
            </div>
            <div className="status-item">
              <span className={`status-indicator ${calendly.client_secret === 'Configurado' ? 'success' : 'error'}`}>
                {calendly.client_secret === 'Configurado' ? '✅' : '❌'}
              </span>
              <span>Client Secret: {calendly.client_secret}</span>
            </div>
          </div>
        </div>

        <div className="status-card">
          <h4>📊 Estado de Conexión</h4>
          <div className="status-details">
            <div className="status-item">
              <span className={`status-indicator ${calendly.can_connect ? 'success' : 'warning'}`}>
                {calendly.can_connect ? '✅' : '⚠️'}
              </span>
              <span>Conexión a Calendly: {calendly.can_connect ? 'Disponible' : 'No disponible'}</span>
            </div>
            <div className="status-item">
              <span className="status-indicator info">📅</span>
              <span>Eventos de Prueba: {test_events}</span>
            </div>
          </div>
        </div>
      </div>

      {!calendly.can_connect && (
        <div className="setup-instructions">
          <h4>🔧 Configuración de Integración Real</h4>
          <p>Para tener una integración 100% real con Calendly (sin eventos de demostración), necesitas configurar tu Access Token:</p>
          
          <div className="code-block">
            <pre>
{`# Calendly Real Configuration
CALENDLY_ACCESS_TOKEN=tu_access_token_real_aqui

# Ejemplo:
CALENDLY_ACCESS_TOKEN=cal_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
            </pre>
          </div>

          <div className="setup-steps">
            <h5>🚀 Pasos para configuración rápida:</h5>
            <ol>
              <li><strong>Opción 1 - Script automático:</strong>
                <br />En el backend: <code>npm run setup:calendly</code>
              </li>
              <li><strong>Opción 2 - Manual:</strong>
                <br />Ve a <a href="https://calendly.com/app/admin/integrations/api_keys" target="_blank" rel="noopener noreferrer">Calendly API Keys</a>
              </li>
              <li>Crea una nueva API Key con permisos: Read Event Types, Read Scheduled Events, Create Scheduling Links</li>
              <li>Copia el Access Token (empieza con "cal_")</li>
              <li>Agrega <code>CALENDLY_ACCESS_TOKEN=tu_token</code> a tu archivo <code>.env</code></li>
              <li>Reinicia el servidor backend</li>
            </ol>
          </div>

          <div className="note">
            <p><strong>🎯 Resultado:</strong> Una vez configurado, verás eventos reales de tu cuenta de Calendly, sin ningún evento de demostración.</p>
          </div>
        </div>
      )}

      {calendly.can_connect && (
        <div className="success-message">
          <h4>✅ Calendly Configurado Correctamente</h4>
          <p>Tu aplicación está conectada a Calendly y puede obtener eventos reales.</p>
        </div>
      )}
    </div>
  );
};

export default CalendlyStatus; 