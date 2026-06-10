import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../features/home/pages/Home'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import Dashboard from '../features/products/pages/Dashboard'
import CreateProduct from '../features/products/pages/CreateProduct'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/seller",
    children: [
      {
        path : '/seller/create-product',
        element : <CreateProduct/>
      },
      {
        path : '/seller/dashboard',
        element : <Dashboard/>
      }
    ]
  }
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
