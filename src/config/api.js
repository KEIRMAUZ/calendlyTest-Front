// Configuración de la API para conectar con el backend NestJS
export const API_CONFIG = {
  // URL base del backend
  BASE_URL: 'http://localhost:3000',
  
  // Headers por defecto para las peticiones
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración para peticiones con credenciales
  CREDENTIALS: 'include',
};

// Función helper para hacer peticiones al backend
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    credentials: API_CONFIG.CREDENTIALS,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error;
  }
};

// Funciones específicas para diferentes endpoints
export const api = {
  // Autenticación
  auth: {
    google: () => apiRequest('/auth/google'),
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    profile: () => apiRequest('/auth/profile'),
    verify: () => apiRequest('/auth/verify'),
  },
  
  // Calendly
  calendly: {
    // Eventos
    getEvents: () => apiRequest('/calendly/events'),
    createEvent: (eventData) => apiRequest('/calendly/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    
    // Estadísticas
    getStats: () => apiRequest('/calendly/stats'),
    
    // Tipos de evento
    getEventTypes: () => apiRequest('/calendly/event-types'),
    
    // Eventos programados
    getScheduledEvents: (params = {}) => {
      const queryParams = new URLSearchParams(params).toString();
      return apiRequest(`/calendly/scheduled-events${queryParams ? `?${queryParams}` : ''}`);
    },
    
    // Eventos próximos
    getUpcomingEvents: (days = 30) => apiRequest(`/calendly/upcoming-events?days=${days}`),
    
    // Información del usuario
    getUserInfo: () => apiRequest('/calendly/user-info'),
    
    // Enlaces de programación
    createSchedulingLink: (eventTypeUri, maxEventCount = 1) => apiRequest('/calendly/scheduling-links', {
      method: 'POST',
      body: JSON.stringify({ eventTypeUri, maxEventCount }),
    }),
    
    // Detalles del invitado
    getInviteeDetails: (inviteeUri) => apiRequest(`/calendly/invitee-details?invitee_uri=${encodeURIComponent(inviteeUri)}`),
    
    // Analytics de eventos
    getEventAnalytics: (eventTypeUri, startDate, endDate) => {
      const params = new URLSearchParams({
        event_type_uri: eventTypeUri,
        start_date: startDate,
        end_date: endDate,
      }).toString();
      return apiRequest(`/calendly/event-analytics?${params}`);
    },
    
    // OAuth
    connect: () => apiRequest('/calendly/connect'),
    callback: (code) => apiRequest(`/calendly/callback?code=${code}`),
  },
}; 