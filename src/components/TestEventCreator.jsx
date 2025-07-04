import React, { useState, useEffect } from 'react';
import { api } from '../config/api';
import { checkAuthStatus } from '../config/auth.js';

const TestEventCreator = ({ onEventCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Cargar email del usuario al montar el componente
  useEffect(() => {
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    try {
      const authStatus = await checkAuthStatus();
      if (authStatus.authenticated && authStatus.user?.email) {
        setUserEmail(authStatus.user.email);
      }
    } catch (error) {
      console.error('Error cargando email del usuario:', error);
    }
  };

  const createQuickTestEvent = async () => {
    setIsCreating(true);
    setMessage('');

    try {
      const testEventData = {
        title: `Evento de Prueba ${new Date().toLocaleString()}`,
        description: 'Este es un evento de prueba creado automáticamente',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Mañana + 1 hora
        location: 'Oficina Virtual',
        attendees: userEmail ? [userEmail, 'test@example.com'] : ['test@example.com', 'usuario@test.com'],
        maxAttendees: 5
      };

      const response = await api.calendly.createEvent(testEventData);
      
      setMessage('✅ Evento de prueba creado exitosamente');
      
      if (onEventCreated) {
        onEventCreated(response.data);
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error creando evento de prueba:', error);
      setMessage('❌ Error al crear evento de prueba: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const createCustomTestEvent = async () => {
    setIsCreating(true);
    setMessage('');

    try {
      // Solicitar datos al usuario
      const title = prompt('📝 Título del evento:') || 'Evento Personalizado';
      const description = prompt('📝 Descripción del evento:') || 'Evento creado personalmente';
      const location = prompt('📍 Ubicación:') || 'Ubicación personalizada';
      const attendees = prompt('👥 Invitados (emails separados por comas):', userEmail || 'usuario@test.com') || (userEmail || 'usuario@test.com');
      
      // Calcular fecha (mañana por defecto)
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const startDate = prompt('📅 Fecha de inicio (YYYY-MM-DD HH:MM):', 
        tomorrow.toISOString().slice(0, 16).replace('T', ' ')) || tomorrow.toISOString();
      
      const duration = prompt('⏱️ Duración en minutos:') || '60';
      const endDate = new Date(new Date(startDate).getTime() + parseInt(duration) * 60 * 1000).toISOString();

      const testEventData = {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate,
        location,
        attendees: attendees.split(',').map(email => email.trim()),
        maxAttendees: parseInt(prompt('👥 Máximo de asistentes:') || '5')
      };

      const response = await api.calendly.createEvent(testEventData);
      
      setMessage('✅ Evento personalizado creado exitosamente');
      
      if (onEventCreated) {
        onEventCreated(response.data);
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error creando evento personalizado:', error);
      setMessage('❌ Error al crear evento personalizado: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const clearTestEvents = async () => {
    try {
      await api.calendly.clearTestEvents();
      setMessage('🗑️ Eventos de prueba eliminados');
      
      if (onEventCreated) {
        onEventCreated(null); // Trigger refresh
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error eliminando eventos de prueba:', error);
      setMessage('❌ Error al eliminar eventos de prueba');
    }
  };

  return (
    <div className="test-event-creator">
      <h3>🧪 Creador de Eventos de Prueba</h3>
      
      {message && (
        <div className={`alert ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
          <span>{message}</span>
        </div>
      )}

      <div className="test-actions">
        <button
          onClick={createQuickTestEvent}
          disabled={isCreating}
          className="button primary"
        >
          {isCreating ? '🔄 Creando...' : '➕ Crear Evento Rápido'}
        </button>

        <button
          onClick={createCustomTestEvent}
          disabled={isCreating}
          className="button secondary"
        >
          {isCreating ? '🔄 Creando...' : '✏️ Crear Evento Personalizado'}
        </button>

        <button
          onClick={clearTestEvents}
          className="button danger"
        >
          🗑️ Limpiar Eventos de Prueba
        </button>
      </div>

      <div className="test-info">
        <p><strong>Opciones disponibles:</strong></p>
        <ul>
          <li><strong>➕ Crear Evento Rápido:</strong> Crea un evento automático con datos por defecto</li>
          <li><strong>✏️ Crear Evento Personalizado:</strong> Te permite ingresar todos los datos del evento</li>
          <li><strong>🗑️ Limpiar Eventos:</strong> Elimina todos los eventos de prueba</li>
          <li>💾 Todos los eventos se guardan en memoria del servidor</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEventCreator; 