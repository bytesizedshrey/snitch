import { useEffect, useState } from 'react'
import { Provider, useSelector } from 'react-redux'
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
  }, [handleFetchMe])

  if (!init) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-['Noto_Sans']">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[18px] font-medium tracking-tight animate-pulse text-white">snitch.</span>
          <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-[#555555]">Initializing session...</span>
        </div>
      </div>
    )
  }

  return (
    <AppRoutes />
  )
}

const App = () => {
  const user = useSelector(state => state.auth.user)
  console.log(user)
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App