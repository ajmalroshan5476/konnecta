import React from 'react'
import Home from './pages/Home'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import ChatApp from './pages/privateChatroom'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/registration' element={<RegistrationPage />} />
        <Route path='/chat' element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App



