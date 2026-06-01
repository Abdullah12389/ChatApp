import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthContext,MainApp,CommIdContext } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContext>
      <CommIdContext>
        <MainApp />
      </CommIdContext>
    </AuthContext>
  </StrictMode>,
)
