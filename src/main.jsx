import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import { LocaleProvider } from './i18n/LocaleContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocaleProvider>
      <App />
      <Analytics />
    </LocaleProvider>
  </React.StrictMode>
)