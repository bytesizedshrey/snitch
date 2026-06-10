import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app.store'
import AppRoutes from './app.routes'
import { useAuth } from '../features/auth/hook/useAuth'
import './App.css'

const AppContent = () => {
  const { handleFetchMe } = useAuth()
  const [init, setInit] = useState(false)

  useEffect(() => {
    handleFetchMe().finally(() => {
      setInit(true)
    })
  }, [])

  if (!init) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-['DM_Sans']">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[18px] font-medium tracking-tight animate-pulse text-white">snitch.</span>
          <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-[#555555]">Initializing session...</span>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App