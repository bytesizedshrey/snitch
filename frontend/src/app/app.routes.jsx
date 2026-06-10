import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../features/home/pages/Home'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import Dashboard from '../features/products/pages/Dashboard'
import CreateProduct from '../features/products/pages/CreateProduct'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/seller/create-product" element={<CreateProduct />} />
    </Routes>
  )
}
