import React, { useState, useEffect } from 'react';
import { api } from '../config/api';

const EventList = ({ refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, [refreshTrigger]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.calendly.getEvents();
      setEvents(response.data?.collection || []);
    } catch (error) {
      console.error('Error cargando eventos:', error);
      setError('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    try {
      await api.calendly.deleteEvent(eventId);
      setEvents(events.filter(event => event.uri !== eventId));
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento');
    }
  };

  const handleRefresh = () => {
    loadEvents();
  };

  const filteredEvents = events.filter(event => {
    let matchesFilter = filter === 'all';
    
    if (filter === 'upcoming' || filter === 'past') {
      try {
        const eventTime = new Date(event.start_time);
        if (!isNaN(eventTime.getTime())) {
          const now = new Date();
          if (filter === 'upcoming') {
            matchesFilter = eventTime > now;
          } else if (filter === 'past') {
            matchesFilter = eventTime <= now;
          }
        } else {
          matchesFilter = false; // Si la fecha es inválida, no mostrar en filtros específicos
        }
      } catch (error) {
        matchesFilter = false;
      }
    }
    
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Mexico_City'
      });
    } catch (error) {
      console.error('Error formateando fecha:', dateString, error);
      return 'Error en fecha';
    }
  };

  const getEventStatus = (startTime) => {
    if (!startTime) {
      return { status: 'unknown', label: 'Desconocido', color: 'gray' };
    }
    
    try {
      const now = new Date();
      const eventTime = new Date(startTime);
      
      if (isNaN(eventTime.getTime())) {
        return { status: 'unknown', label: 'Fecha inválida', color: 'gray' };
      }
      
      if (eventTime > now) {
        return { status: 'upcoming', label: 'Próximo', color: 'blue' };
      } else {
        return { status: 'past', label: 'Pasado', color: 'gray' };
      }
    } catch (error) {
      console.error('Error obteniendo estado del evento:', error);
      return { status: 'unknown', label: 'Error', color: 'gray' };
    }
  };

  const getEventTypeIcon = (event) => {
    // Si es un evento personalizado
    if (event.is_custom_event || event.is_test_event) {
      return '➕';
    }
    
    // Para eventos de Calendly
    const eventType = event.event_type?.toLowerCase();
    switch (eventType) {
      case 'meeting':
        return '🤝';
      case 'call':
        return '📞';
      case 'consultation':
        return '💼';
      default:
        return '📅';
    }
  };

  if (loading) {
    return (
      <div className="event-list-container">
        <div className="loading-container">
          <span className="spinner">🔄</span>
          <p>Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>📅 Mis Eventos</h2>
        <button onClick={handleRefresh} className="refresh-button">
          🔄 Actualizar
        </button>
      </div>

      {error && (
        <div className="alert error">
          <span>❌ {error}</span>
        </div>
      )}

      <div className="event-list-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos ({events.length})
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Próximos ({events.filter(e => {
              try {
                const eventTime = new Date(e.start_time);
                return !isNaN(eventTime.getTime()) && eventTime > new Date();
              } catch {
                return false;
              }
            }).length})
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Pasados ({events.filter(e => {
              try {
                const eventTime = new Date(e.start_time);
                return !isNaN(eventTime.getTime()) && eventTime <= new Date();
              } catch {
                return false;
              }
            }).length})
          </button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
              <div className="empty-state">
        📅
        <h3>No hay eventos</h3>
          <p>
            {searchTerm 
              ? 'No se encontraron eventos que coincidan con tu búsqueda.'
              : filter === 'upcoming' 
                ? 'No tienes eventos próximos programados.'
                : filter === 'past'
                  ? 'No tienes eventos pasados.'
                  : 'No tienes eventos creados aún.'
            }
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event.start_time);
            
            return (
              <div key={event.uri || event.id} className={`event-card ${status.status}`}>
                <div className="event-header">
                  <div className="event-icon">
                    {getEventTypeIcon(event)}
                  </div>
                  <div className="event-status">
                    <span className={`status-badge ${status.color}`}>
                      {status.label}
                    </span>
                    {(event.is_custom_event || event.is_test_event) && (
                      <span className="custom-event-badge">
                        Personalizado
                      </span>
                    )}
                  </div>
                </div>

                <div className="event-content">
                  <h3 className="event-title">{event.name || 'Evento sin título'}</h3>
                  
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}

                  <div className="event-details">
                    <div className="event-detail">
                      🕐 Inicio: <span>{formatDate(event.start_time)}</span>
                    </div>
                    
                    {event.end_time && (
                      <div className="event-detail">
                        🕐 Fin: <span>{formatDate(event.end_time)}</span>
                      </div>
                    )}
                    
                    {event.created_at && (
                      <div className="event-detail">
                        📅 Creado: <span>{formatDate(event.created_at)}</span>
                      </div>
                    )}
                    
                    {event.location && event.location !== 'Sin ubicación' && (
                      <div className="event-detail">
                        📍 <span>{event.location}</span>
                      </div>
                    )}

                    {event.invitees && event.invitees.length > 0 && (
                      <div className="event-detail">
                        👥 <span>{event.invitees.length} invitado(s)</span>
                      </div>
                    )}
                    
                    {event.invitee && (
                      <div className="event-detail">
                        👤 Invitado: <span>{event.invitee.email} ({event.invitee.name})</span>
                      </div>
                    )}
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="event-detail">
                        👥 Asistentes: <span>{event.attendees.join(', ')}</span>
                      </div>
                    )}

                    {/* Mostrar información adicional para eventos personalizados */}
                    {event.customData && (
                      <>
                        {event.customData.duration && (
                          <div className="event-detail">
                            ⏱️ Duración: <span>{event.customData.duration} minutos</span>
                          </div>
                        )}
                        {event.customData.maxAttendees && (
                          <div className="event-detail">
                            👥 Máx. asistentes: <span>{event.customData.maxAttendees}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {event.event_type && (
                    <div className="event-type">
                      <span className="event-type-label">Tipo:</span>
                      <span className="event-type-value">{event.event_type}</span>
                    </div>
                  )}
                </div>

                <div className="event-actions">
                  {/* Solo mostrar enlace a Calendly para eventos reales */}
                  {event.uri && !event.is_custom_event && !event.is_test_event && (
                    <a
                      href={event.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button view"
                    >
                      🔗 Ver en Calendly
                    </a>
                  )}
                  
                  <button
                    onClick={() => handleDeleteEvent(event.uri || event.id)}
                    className="action-button delete"
                    title="Eliminar evento"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="event-list-footer">
        <p className="event-count">
          Mostrando {filteredEvents.length} de {events.length} eventos
        </p>
      </div>
    </div>
  );
};

export default EventList; 