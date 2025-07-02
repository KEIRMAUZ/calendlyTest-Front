import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BackendTest from './components/BackendTest.jsx'
import CalendlyTest from './components/CalendlyTest.jsx'

function App() {
  const [count, setCount] = useState(0)
  const [showBackendTest, setShowBackendTest] = useState(false)
  const [showCalendlyTest, setShowCalendlyTest] = useState(false)

  return (
    <div className="container">
      <div className="header">
        <div className="logos">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React + Backend Test</h1>
        <p>Prueba la conexión con tu backend NestJS y Calendly</p>
      </div>
      
      <div className="card">
        <h2>🎯 Contador de Ejemplo</h2>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="button"
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            count is {count}
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setShowBackendTest(!showBackendTest)}
            className={`button ${showBackendTest ? 'danger' : 'secondary'}`}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {showBackendTest ? '🔒 Ocultar Prueba Backend' : '🧪 Mostrar Prueba Backend'}
          </button>
          
          <button 
            onClick={() => setShowCalendlyTest(!showCalendlyTest)}
            className={`button ${showCalendlyTest ? 'danger' : 'secondary'}`}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {showCalendlyTest ? '📅 Ocultar Prueba Calendly' : '📅 Mostrar Prueba Calendly'}
          </button>
        </div>
      </div>
      
      {showBackendTest && <BackendTest />}
      {showCalendlyTest && <CalendlyTest />}
      
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
