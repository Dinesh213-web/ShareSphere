import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'

// Dynamically set backend base URL depending on development vs production
axios.defaults.baseURL = import.meta.env.DEV ? "http://localhost:3000" : "/_/backend";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)