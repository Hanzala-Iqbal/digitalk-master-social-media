import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";

import { DigiTalkProvider } from './context/DigitalkContext'
import { UniversityProvider } from './context/UniversityContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <DigiTalkProvider>
  <UniversityProvider>
      <React.StrictMode>
        <BrowserRouter>
        
        <App/>
       
        </BrowserRouter>
      </React.StrictMode>,
  </UniversityProvider>
  </DigiTalkProvider>
)
