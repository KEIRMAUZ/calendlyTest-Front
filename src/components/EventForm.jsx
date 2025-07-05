import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../config/api';
import { checkAuthStatus } from '../config/auth.js';

const EventForm = ({ onEventCreated, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const watchStartDate = watch('startDate');
  const watchDuration = watch('duration');

  // Función para formatear fecha y hora para input datetime-local
  const formatDateTimeForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Función para obtener fecha mínima (hoy)
  const getMinDateTime = () => {
    const now = new Date();
    return formatDateTimeForInput(now);
  };

  // Cargar tipos de eventos de Calendly y obtener email del usuario
  useEffect(() => {
    loadEventTypes();
    loadUserEmail();
  }, []);

  const loadEventTypes = async () => {
    try {
      const response = await api.calendly.getEventTypes();
      setEventTypes(response.data?.collection || []);
    } catch (error) {
      console.error('Error cargando tipos de eventos:', error);
    }
  };

  const loadUserEmail = async () => {
    try {
      const authStatus = await checkAuthStatus();
      if (authStatus.authenticated && authStatus.user?.email) {
        setUserEmail(authStatus.user.email);
        // Establecer el email por defecto en el campo de invitados
        setValue('attendees', authStatus.user.email);
      }
    } catch (error) {
      console.error('Error cargando email del usuario:', error);
    }
  };

  // Calcular fecha de fin basada en fecha de inicio y duración
  useEffect(() => {
    if (watchStartDate && watchDuration) {
      const startDate = new Date(watchStartDate);
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + parseInt(watchDuration));
      setValue('endDate', formatDateTimeForInput(endDate));
    }
  }, [watchStartDate, watchDuration, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
              const eventData = {
          title: data.title,
          description: data.description,
          location: data.location,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          attendees: data.attendees ? data.attendees.split(',').map(email => email.trim()) : [],
          eventTypeUri: selectedEventType?.uri,
          isCustomEvent: showCustomForm,
          duration: parseInt(data.duration),
          maxAttendees: parseInt(data.maxAttendees) || 1,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

      console.log('Creando evento:', eventData);

      // Si es un evento personalizado o no hay tipo de evento seleccionado, crear directamente
      if (showCustomForm || !selectedEventType) {
        const response = await api.calendly.createCustomEvent(eventData);
        setSuccess('Evento personalizado creado exitosamente');
        if (onEventCreated) {
          onEventCreated(response.data);
        }
      } else {
        // Si es un evento de Calendly, crear enlace de programación
        const response = await api.calendly.createSchedulingLink(
          selectedEventType.uri,
          eventData.maxAttendees
        );
        setSuccess('Enlace de programación creado exitosamente');
        if (onEventCreated) {
          onEventCreated({
            ...response.data,
            eventType: selectedEventType,
            customData: eventData
          });
        }
      }

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        reset();
        setSelectedEventType(null);
        setShowCustomForm(false);
        setSuccess(null);
      }, 2000);

    } catch (error) {
      console.error('Error creando evento:', error);
      setError(error.message || 'Error al crear el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventTypeSelect = (eventType) => {
    setSelectedEventType(eventType);
    setShowCustomForm(false);
    setValue('title', eventType.name);
    setValue('description', eventType.description || '');
    setValue('duration', eventType.duration || 30);
  };

  const handleCustomEventToggle = () => {
    setShowCustomForm(!showCustomForm);
    setSelectedEventType(null);
    reset();
    
    // Si se activa el modo personalizado, habilitar todos los campos
    if (!showCustomForm) {
      setValue('title', '');
      setValue('description', '');
      setValue('duration', '');
      setValue('location', '');
      setValue('attendees', userEmail || ''); // Mantener el email del usuario
      setValue('maxAttendees', '1');
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-form-header">
        <h2>📅 Crear Nuevo Evento</h2>
        <button onClick={onClose} className="close-button">
          ❌
        </button>
      </div>

      {error && (
        <div className="alert error">
          <span>❌ {error}</span>
        </div>
      )}

      {success && (
        <div className="alert success">
          <span>✅ {success}</span>
        </div>
      )}

      <div className="form-tabs">
        <button
          className={`tab ${!showCustomForm ? 'active' : ''}`}
          onClick={() => setShowCustomForm(false)}
        >
          📅 Eventos de Calendly
        </button>
        <button
          className={`tab ${showCustomForm ? 'active' : ''}`}
          onClick={handleCustomEventToggle}
        >
          ➕ Evento Personalizado
        </button>
      </div>

      {!showCustomForm && eventTypes.length > 0 && (
        <div className="event-types-section">
          <h3>Selecciona un tipo de evento:</h3>
          <div className="event-types-grid">
            {eventTypes.map((eventType) => (
              <div
                key={eventType.uri}
                className={`event-type-card ${selectedEventType?.uri === eventType.uri ? 'selected' : ''}`}
                onClick={() => handleEventTypeSelect(eventType)}
              >
                <h4>{eventType.name}</h4>
                <p>{eventType.description || 'Sin descripción'}</p>
                <div className="event-type-meta">
                  <span>⏱️ {eventType.duration} min</span>
                  <span>💰 {eventType.price ? `$${eventType.price}` : 'Gratis'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCustomForm && (
        <div className="custom-event-notice">
          <p>🎯 <strong>Modo Evento Personalizado:</strong> Crea un evento completamente personalizado con tus propios datos. Todos los campos están habilitados para que puedas personalizar completamente tu evento.</p>
          <div className="custom-form-tips">
            <p><strong>💡 Consejos:</strong></p>
            <ul>
              <li>Puedes escribir cualquier título y descripción</li>
              <li>Selecciona la fecha y hora que prefieras</li>
              <li>Agrega tu ubicación personalizada</li>
              <li>Incluye los emails de los invitados que quieras</li>
              <li>Define el número máximo de asistentes</li>
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="event-form">
        <div className="form-group">
          <label htmlFor="title">
            📝 Título del Evento *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'El título es requerido' })}
            placeholder="Ej: Reunión de proyecto"
            disabled={selectedEventType && !showCustomForm}
            className={selectedEventType && !showCustomForm ? 'disabled' : ''}
          />
          {errors.title && <span className="error-text">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            📝 Descripción
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Describe el evento..."
            rows={3}
            disabled={selectedEventType && !showCustomForm}
            className={selectedEventType && !showCustomForm ? 'disabled' : ''}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">
              📅 Fecha y Hora de Inicio *
            </label>
            <input
              id="startDate"
              type="datetime-local"
              {...register('startDate', { required: 'La fecha de inicio es requerida' })}
              min={getMinDateTime()}
              className="date-picker"
            />
            {errors.startDate && <span className="error-text">{errors.startDate.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              ⏱️ Duración (minutos) *
            </label>
            <select
              id="duration"
              {...register('duration', { required: 'La duración es requerida' })}
              disabled={selectedEventType && !showCustomForm}
              className={selectedEventType && !showCustomForm ? 'disabled' : ''}
            >
              <option value="">Selecciona duración</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
            {errors.duration && <span className="error-text">{errors.duration.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">
            📍 Ubicación
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            placeholder="Ej: Oficina principal, Zoom, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="attendees">
            👥 Invitados (emails separados por comas)
            {userEmail && <span className="user-email-hint"> - Tu email: {userEmail}</span>}
          </label>
          <input
            id="attendees"
            type="text"
            {...register('attendees')}
            placeholder={userEmail ? `${userEmail}, otro@email.com` : "ejemplo@email.com, otro@email.com"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxAttendees">
            👥 Máximo de Asistentes
          </label>
          <input
            id="maxAttendees"
            type="number"
            {...register('maxAttendees', { min: 1, max: 100 })}
            placeholder="1"
            min="1"
            max="100"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="button secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creando...
              </>
            ) : (
              <>
                📤 Crear Evento
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 