import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Checkbox } from '../../../components/ui/checkbox'
import { Button } from '../../../components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    password: '',
    isSeller: false
  })
  
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const nameInputRef = useRef(null)

  // Autofocus on first input (Full Name) on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [])

  // Format phone number dynamically as (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return value
    const digits = value.replace(/[^\d]/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'contactNumber') {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    // Clear error for this field on input change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, isSeller: checked }))
  }

  // Comprehensive front-end validation
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }
    
    const phoneDigits = formData.contactNumber.replace(/[^\d]/g, '')
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required'
    } else if (phoneDigits.length < 10) {
      newErrors.contactNumber = 'Must be a valid 10-digit number'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email address is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate premium SaaS register call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      // Reset form after delay
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          fullName: '',
          contactNumber: '',
          email: '',
          password: '',
          isSeller: false
        })
        if (nameInputRef.current) {
          nameInputRef.current.focus()
        }
      }, 2000)
    }, 1500)
  }

  return (
    <div className="register-page flex items-center justify-center min-h-screen px-4 py-8">
      <div 
        className="absolute top-[-10%] left-[50%] h-[600px] w-[800px] -translate-x-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035),transparent_70%)]" 
        style={{ pointerEvents: 'none' }}
      />

      <div className="register-container relative w-full max-w-[460px] z-10 transition-all duration-300">
        <Card className="border-[#3f3f46]/20 bg-[#18181b]/80 backdrop-blur-xl rounded-lg">
          <CardHeader className="space-y-2 text-center pb-6 border-b border-[#3f3f46]/10">
            <CardTitle className="text-2xl font-light tracking-wide text-white">Create an Account</CardTitle>
            <CardDescription className="text-neutral-400 font-light text-sm">
              Enter your details to register on our platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8 space-y-5">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in text-center">
                <div className="success-checkmark flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#09090b]">
                  <svg className="h-6 w-6 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-white">Registration Successful</h4>
                  <p className="text-sm text-neutral-400 font-light">Welcome! Your account has been created.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fullName">Full Name</Label>
                    {errors.fullName && (
                      <span className="text-xs text-red-400 font-light tracking-wide animate-fade-in">{errors.fullName}</span>
                    )}
                  </div>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    ref={nameInputRef}
                    placeholder="Charles Leclerc"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? "border-red-500/40 focus:border-red-500" : ""}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    {errors.contactNumber && (
                      <span className="text-xs text-red-400 font-light tracking-wide animate-fade-in">{errors.contactNumber}</span>
                    )}
                  </div>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={errors.contactNumber ? "border-red-500/40 focus:border-red-500" : ""}
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email Address</Label>
                    {errors.email && (
                      <span className="text-xs text-red-400 font-light tracking-wide animate-fade-in">{errors.email}</span>
                    )}
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500/40 focus:border-red-500" : ""}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {errors.password && (
                      <span className="text-xs text-red-400 font-light tracking-wide animate-fade-in">{errors.password}</span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pr-10 ${errors.password ? "border-red-500/40 focus:border-red-500" : ""}`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      disabled={isLoading}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* isSeller checkbox */}
                <div className="flex items-center space-x-3 pt-1 select-none">
                  <Checkbox
                    id="isSeller"
                    checked={formData.isSeller}
                    onCheckedChange={handleCheckboxChange}
                    disabled={isLoading}
                  />
                  <Label 
                    htmlFor="isSeller" 
                    className="text-xs font-light text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                  >
                    Register as Seller
                  </Label>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full mt-6 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#09090b]" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Register</span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-[#3f3f46]/10 pt-6 mt-4">
            <a 
              href="#login" 
              className="text-xs font-light text-neutral-500 hover:text-white hover:underline transition-colors duration-200"
            >
              Already have an account? Login
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Register