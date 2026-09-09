import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FacilityProvider } from './context/FacilityContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FacilityProvider>
      <App />
    </FacilityProvider>
  </React.StrictMode>,
)
