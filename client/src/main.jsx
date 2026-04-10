import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { IphoneSpecsProvider } from './context/IphoneSpecsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <IphoneSpecsProvider>
          <App />
        </IphoneSpecsProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
