# 🧪 Prueba de Conexión Frontend-Backend

Este proyecto está configurado para probar la conexión entre un frontend React con Vite y un backend NestJS.

## 📋 Configuración CORS

El backend está configurado para aceptar **SOLO** peticiones de:
- `http://localhost:5173` (puerto por defecto de Vite)
- `http://127.0.0.1:5173` (alternativa localhost)
- `http://localhost:4173` (puerto de preview de Vite)
- `http://127.0.0.1:4173` (alternativa preview)

## 🚀 Cómo ejecutar

### 1. Iniciar el Backend (NestJS)
```bash
cd Calendly
npm install
npm run start:dev
```
El backend estará disponible en: `http://localhost:3000`

### 2. Iniciar el Frontend (React + Vite)
```bash
cd test
npm install
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

## 🧪 Cómo probar

1. Abre el navegador en `http://localhost:5173`
2. Haz clic en el botón **"🧪 Mostrar Prueba Backend"**
3. Usa los botones de prueba:
   - **🔗 Probar Conexión**: Prueba la conexión básica al backend
   - **🔐 Probar Auth**: Prueba los endpoints de autenticación
   - **📅 Probar Calendly**: Prueba los endpoints de Calendly

## 📁 Archivos importantes

### Backend (Calendly/)
- `src/main.ts` - Configuración CORS
- `src/auth/` - Endpoints de autenticación
- `src/calendly/` - Endpoints de Calendly

### Frontend (test/)
- `src/config/api.js` - Configuración de la API
- `src/components/BackendTest.jsx` - Componente de prueba
- `src/App.jsx` - Componente principal con botón de prueba

## 🔧 Configuración CORS

El backend está configurado con CORS restrictivo:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173', // Puerto por defecto de Vite
    'http://127.0.0.1:5173', // Alternativa localhost
    'http://localhost:4173', // Puerto de preview de Vite
    'http://127.0.0.1:4173', // Alternativa preview
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
});
```

## 🚨 Solución de problemas

### Error de CORS
Si ves errores de CORS, asegúrate de que:
1. El backend esté corriendo en el puerto 3000
2. El frontend esté corriendo en el puerto 5173
3. Ambos servicios estén activos

### Error de conexión
Si no puedes conectar:
1. Verifica que ambos servicios estén corriendo
2. Revisa la consola del navegador para errores
3. Verifica que no haya otros servicios usando los mismos puertos

## 📝 Notas

- El frontend usa `credentials: 'include'` para enviar cookies y headers de autenticación
- Los endpoints están configurados para trabajar con autenticación JWT
- El componente de prueba muestra el estado en tiempo real
- Los errores se muestran de forma clara en la interfaz 