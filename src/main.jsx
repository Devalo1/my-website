import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LupulSiCorbul from './pages/LupulSiCorbul' // adjust the import path as needed

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lupul-si-corbul" />} />
        <Route path="/lupul-si-corbul" element={<LupulSiCorbul />} />
        {/* ...other routes... */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
