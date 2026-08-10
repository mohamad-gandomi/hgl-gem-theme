import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

const isEnglishPath = window.location.pathname === '/en' || window.location.pathname.startsWith('/en/')
document.documentElement.lang = isEnglishPath ? 'en' : 'fa'
document.documentElement.dir = isEnglishPath ? 'ltr' : 'rtl'

createRoot(document.getElementById('root')).render(<App />)
