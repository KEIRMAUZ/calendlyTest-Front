# 🔐 Autenticación con Google - Frontend + Backend

Este proyecto implementa autenticación completa con Google OAuth2 entre un frontend React con Vite y un backend NestJS.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias del Backend
```bash
cd Calendly
npm install cookie-parser
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `Calendly` con:
```env
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Google OAuth2
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configura las URLs autorizadas:
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `http://localhost:5173`
   - **Authorized redirect URIs:**
     - `http://localhost:3000/auth/google/callback`

## 🏃‍♂️ Cómo Ejecutar

### 1. Iniciar el Backend
```bash
cd Calendly
npm run start:dev
```
El backend estará en: `http://localhost:3000`

### 2. Iniciar el Frontend
```bash
cd test
npm run dev
```
El frontend estará en: `http://localhost:5173`

## 🧪 Probar la Autenticación

1. **Abre el navegador** en `http://localhost:5173`
2. **Haz clic** en "🧪 Mostrar Prueba Backend"
3. **En la sección de autenticación**, haz clic en "Iniciar Sesión con Google"
4. **Selecciona tu cuenta de Google** y autoriza la aplicación
5. **Serás redirigido** de vuelta al frontend con tu sesión activa

## 🔧 Características Implementadas

### Backend (NestJS)
- ✅ **CORS configurado** para solo aceptar peticiones del frontend
- ✅ **Autenticación Google OAuth2** con Passport
- ✅ **JWT tokens** para sesiones seguras
- ✅ **Cookies httpOnly** para almacenamiento seguro
- ✅ **Endpoints de autenticación**:
  - `GET /auth/google` - Iniciar autenticación
  - `GET /auth/google/callback` - Callback de Google
  - `GET /auth/status` - Verificar estado de autenticación
  - `POST /auth/logout` - Cerrar sesión
  - `GET /auth/profile` - Obtener perfil del usuario

### Frontend (React + Vite)
- ✅ **Interfaz moderna** con gradientes y animaciones
- ✅ **Componente de prueba** para verificar conexión
- ✅ **Autenticación con Google** integrada
- ✅ **Manejo de estado** de autenticación
- ✅ **Visualización de perfil** del usuario
- ✅ **Botones de logout** funcionales

## 🎨 Diseño y UX

### Características Visuales
- **Gradientes modernos** en el fondo y botones
- **Animaciones suaves** con CSS transitions
- **Iconos SVG** para Google y estados
- **Badges de estado** con colores intuitivos
- **Responsive design** para móviles
- **Loading spinners** para feedback visual

### Estados de la Interfaz
- **Inactivo** - Gris, listo para usar
- **Cargando** - Amarillo con spinner
- **Éxito** - Verde con checkmark
- **Error** - Rojo con X

## 🔒 Seguridad

### CORS Restrictivo
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173', // Solo Vite
    'http://127.0.0.1:5173',
    'http://localhost:4173', // Preview
    'http://127.0.0.1:4173',
  ],
  credentials: true, // Cookies habilitadas
});
```

### Cookies Seguras
```typescript
res.cookie('jwt', token, {
  httpOnly: true,     // No accesible desde JavaScript
  secure: false,      // true en producción con HTTPS
  sameSite: 'lax',    // Protección CSRF
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
});
```

## 🚨 Solución de Problemas

### Error: "Failed to fetch"
- **Verifica** que el backend esté corriendo en puerto 3000
- **Revisa** la consola del navegador para errores CORS
- **Asegúrate** de que ambos servicios estén activos

### Error de Autenticación Google
- **Verifica** las credenciales de Google OAuth2
- **Confirma** que las URLs estén configuradas correctamente
- **Revisa** que la API de Google+ esté habilitada

### Error de Cookies
- **Asegúrate** de que `cookie-parser` esté instalado
- **Verifica** que las opciones de cookies sean correctas
- **Revisa** que `credentials: 'include'` esté en las peticiones

## 📁 Estructura de Archivos

```
Calendly/ (Backend)
├── src/
│   ├── main.ts              # Configuración CORS y cookies
│   └── auth/
│       ├── auth.controller.ts  # Endpoints de autenticación
│       ├── auth.service.ts     # Lógica de autenticación
│       └── google.strategy.ts  # Estrategia Google OAuth2

test/ (Frontend)
├── src/
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos modernos
│   ├── components/
│   │   └── BackendTest.jsx  # Componente de prueba
│   └── config/
│       ├── api.js           # Configuración API
│       └── auth.js          # Funciones de autenticación
```

## 🎯 Próximos Pasos

1. **Configurar variables de entorno** con tus credenciales de Google
2. **Probar la autenticación** siguiendo las instrucciones
3. **Personalizar el diseño** según tus necesidades
4. **Agregar más endpoints** para funcionalidades adicionales
5. **Implementar refresh tokens** para sesiones más largas

¡La autenticación con Google está lista para usar! 🎉 