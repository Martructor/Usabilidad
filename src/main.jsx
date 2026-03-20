import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
