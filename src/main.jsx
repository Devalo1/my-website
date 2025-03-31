import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Importă reset CSS pentru a elimina stiluri nedorite
import './styles/reset.css'
// Importă stiluri globale
import './index.css'
// Importă utilitar pentru suprimarea console
import './utils/consoleSilencer'
import { silenceConsoleFor } from './utils/consoleSilencer'

// Suprimă mesajele din consolă pentru primele 500ms
silenceConsoleFor(500)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
