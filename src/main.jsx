import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Preloader — hides when React renders
const preloader = document.getElementById('preloader');
if (preloader) {
  // Start fade out ~400ms after mount (logo animation completes)
  setTimeout(() => preloader.classList.add('hidden'), 800);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
