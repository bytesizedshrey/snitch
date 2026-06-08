import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from './app.store'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import Home from '../features/home/pages/Home'
import './App.css'

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App