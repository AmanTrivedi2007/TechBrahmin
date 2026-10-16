import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import TechBrahmin from './TechBrahmin.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TechBrahmin />
  </StrictMode>,
)
