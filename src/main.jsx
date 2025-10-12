import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

import { ClerkProvider } from '@clerk/clerk-react'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function Root() {
  const content = (
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  )

  if (!publishableKey) return content
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {content}
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
