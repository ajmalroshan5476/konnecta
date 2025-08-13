import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 px-4">
      <div className="text-center max-w-xl px-6">
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
          Collab live. <span className="text-red-400">Post fast.</span> Go viral.
        </p>
        <button
          onClick={() => navigate('/registration')}
          className="w-full max-w-xs mx-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600
            text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          🚀 Get Started
        </button>
      </div>
    </div>
  )
}

export default Home






