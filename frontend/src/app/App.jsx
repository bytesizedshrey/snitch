import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { store } from './app.store'
import Register from '../features/auth/pages/Register'
import './App.css'

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<div className="min-h-screen bg-[#0a0a0a] text-primary flex items-center justify-center font-['Geist'] text-[14px]">Login Page Coming Soon</div>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App