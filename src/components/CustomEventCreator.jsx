import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../config/api';
import { checkAuthStatus } from '../config/auth.js';

const CustomEventCreator = ({ onEventCreated, onClose }) => {
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  const watchStartDate = watch('startDate');
  const watchDuration = watch('duration');

  useEffect(() => {
    loadUserEmail();
    // Establecer fecha por defecto (mañana a las 10:00 AM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setValue('startDate', tomorrow.toISOString().slice(0, 16));
    setValue('duration', '60');
    setValue('maxAttendees', '5');
  }, [setValue]);

  const loadUserEmail = async () => {
    try {
      const authStatus = await checkAuthStatus();
      if (authStatus.authenticated && authStatus.user?.email) {
        setUserEmail(authStatus.user.email);
        setValue('attendees', authStatus.user.email);
      }
    } catch (error) {
      console.error('Error cargando email del usuario:', error);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Mínimo 30 minutos en el futuro
    return now.toISOString().slice(0, 16);
  };

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return '';
    const start = new Date(startDate);
    const end = new Date(start.getTime() + parseInt(duration) * 60 * 1000);
    return end.toISOString().slice(0, 16);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Calcular fecha de fin
      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate.getTime() + parseInt(data.duration) * 60 * 1000);

      const eventData = {
        title: data.title,
        description: data.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: data.location,
        attendees: data.attendees ? data.attendees.split(',').map(email => email.trim()) : [],
        maxAttendees: parseInt(data.maxAttendees),
        isCustomEvent: true
      };

      console.log('Creando evento personalizado:', eventData);

      const response = await api.calendly.createCustomEvent(eventData);
      setSuccess('✅ Evento personalizado creado exitosamente');
      
      if (onEventCreated) {
        onEventCreated(response.data);
      }

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        reset();
        setSuccess(null);
        // Restablecer valores por defecto
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        setValue('startDate', tomorrow.toISOString().slice(0, 16));
        setValue('duration', '60');
        setValue('maxAttendees', '5');
        setValue('attendees', userEmail || '');
      }, 2000);

    } catch (error) {
      console.error('Error creando evento personalizado:', error);
      setError(error.message || 'Error al crear el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-form-header">
        <h2>🎯 Crear Evento Personalizado</h2>
        <button onClick={onClose} className="close-button">
          ❌
        </button>
      </div>

      <div className="custom-event-intro">
        <p>✨ <strong>Crea tu evento completamente personalizado</strong></p>
        <p>Llena todos los campos con tus datos reales. Este evento se guardará en el sistema y podrás verlo en la lista de eventos.</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="event-form">
        <div className="form-group">
          <label htmlFor="title">
            📝 Título del Evento *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'El título es requerido' })}
            placeholder="Ej: Reunión de proyecto, Entrevista, Clase de yoga..."
            className="form-input"
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
            placeholder="Describe tu evento, agenda, objetivos, etc..."
            rows={3}
            className="form-textarea"
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
              className="form-select"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
              <option value="240">4 horas</option>
            </select>
            {errors.duration && <span className="error-text">{errors.duration.message}</span>}
          </div>
        </div>

        {watchStartDate && watchDuration && (
          <div className="event-preview">
            <p><strong>📅 Vista previa:</strong></p>
            <p>Inicio: {new Date(watchStartDate).toLocaleString('es-ES')}</p>
            <p>Fin: {new Date(calculateEndDate(watchStartDate, watchDuration)).toLocaleString('es-ES')}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="location">
            📍 Ubicación
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            placeholder="Ej: Oficina principal, Zoom, Cafetería, Gimnasio..."
            className="form-input"
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
            placeholder={userEmail ? `${userEmail}, amigo@email.com, colega@empresa.com` : "tu@email.com, amigo@email.com"}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxAttendees">
            👥 Máximo de Asistentes
          </label>
          <input
            id="maxAttendees"
            type="number"
            {...register('maxAttendees', { 
              required: 'El máximo de asistentes es requerido',
              min: { value: 1, message: 'Mínimo 1 asistente' },
              max: { value: 100, message: 'Máximo 100 asistentes' }
            })}
            min="1"
            max="100"
            className="form-input"
          />
          {errors.maxAttendees && <span className="error-text">{errors.maxAttendees.message}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="button primary"
          >
            {isSubmitting ? '🔄 Creando...' : '✅ Crear Evento Personalizado'}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="button secondary"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomEventCreator; 