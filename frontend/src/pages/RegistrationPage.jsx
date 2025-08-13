import React, { useState } from 'react'


const InputField = ({ name, type = "text", placeholder, value, onChange, error }) => (
  <div className="mb-4">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border ${
        error ? 'border-red-500' : 'border-gray-700'
      } focus:outline-none focus:border-purple-500 transition-colors`}
      required
      autoComplete="off"
    />
    {error && <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>}
  </div>
)

const RegistrationPage = () => {
  const [role, setRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    techStack: '',
    ytChannel: ''
  })
  const [errors, setErrors] = useState({})

  // Validation helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password) => password.length >= 8

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name can't be empty! ✨"
    if (!formData.email.trim()) newErrors.email = "Gotta have an email! 📧"
    else if (!validateEmail(formData.email)) newErrors.email = "Hmm, that email looks off 🚫"
    if (!formData.password) newErrors.password = "Password please 🔐"
    else if (!validatePassword(formData.password)) newErrors.password = "Make it 8+ characters for security 💪"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don’t match! 😬"
    
    if (role === 'editor' && !formData.techStack.trim()) newErrors.techStack = "Tell us your editing skills 🎬"
    if (role === 'creator' && !formData.ytChannel.trim()) newErrors.ytChannel = "Drop your YouTube channel name! 📺"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      alert(`You're in! Registered as ${role} 🎉\n\nDetails:\n` + JSON.stringify({ role, ...formData }, null, 2))
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        techStack: '',
        ytChannel: ''
      })
      setRole(null)
      setErrors({})
    }
  }

  // Button style helper
  const roleButtonClass = (colorFrom, colorTo) =>
    `w-full bg-gradient-to-r from-${colorFrom} to-${colorTo} hover:from-${colorFrom} hover:to-${colorTo} text-white font-bold py-6 rounded-xl mb-4 transition duration-300 transform hover:scale-105 shadow-lg`

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 px-4 py-8">
      <div className="bg-gray-900/80 p-8 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-sm border border-gray-700">

        {/* Role Selection */}
        {!role && (
          <>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 text-center">
              Who are you? ✨
            </h2>
            <p className="text-gray-400 text-center mb-8">Pick your path and let’s get started! 🚀</p>

            <button
              onClick={() => setRole('creator')}
              className={roleButtonClass('red-500', 'orange-500')}
            >
              🎬 Content Creator
            </button>

            <button
              onClick={() => setRole('editor')}
              className={roleButtonClass('blue-500', 'cyan-500')}
            >
              💻 Video Editor
            </button>
          </>
        )}

        {/* Role-specific form */}
        {role && (
          <form onSubmit={handleSubmit}>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 text-center">
              Register as {role === 'creator' ? 'Content Creator' : 'Editor'} ✨
            </h2>

            <InputField
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <InputField
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <InputField
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <InputField
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
            />

            {role === 'creator' && (
              <>
                <InputField
                  name="ytChannel"
                  placeholder="YouTube channel name"
                  value={formData.ytChannel}
                  onChange={handleInputChange}
                  error={errors.ytChannel}
                />
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-300 text-sm">Helps connect you with the right editors!</p>
                </div>
              </>
            )}

            {role === 'editor' && (
              <>
                <InputField
                  name="techStack"
                  placeholder="Editing tools & skills"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  error={errors.techStack}
                />
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <p className="text-blue-300 text-sm">Helps creators find the perfect editor!</p>
                </div>
              </>
            )}

            <button
              type="submit"
              className={`w-full ${
                role === 'creator'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
              } text-white font-bold py-4 rounded-xl mb-4 transition duration-300 transform hover:scale-105 shadow-lg`}
            >
              Complete Registration {role === 'creator' ? '🚀' : '🔥'}
            </button>

            {/* Switch role button */}
            <button
              type="button"
              onClick={() => setRole(role === 'creator' ? 'editor' : 'creator')}
              className={`w-full ${
                role === 'creator'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              } text-white font-bold py-3 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg`}
            >
              {role === 'creator' ? '💻 Actually, I edit' : '🎬 Actually, I create content'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegistrationPage



