"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { userStorage } from "../utils/userStorage"
import "./LoginPage.css"
import { loginUser } from "../api/auth"

// Icons (keeping all existing icons)
const MailIcon = () => (
  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const LockIcon = () => (
  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

const EyeIcon = () => (
  <svg className="password-toggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const EyeOffIcon = () => (
  <svg className="password-toggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
)

const CheckIcon = () => (
  <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = () => (
  <svg className="x-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LoaderIcon = () => (
  <svg className="loader-icon" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const CodeIcon = () => (
  <svg className="logo-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const SunIcon = () => (
  <svg className="theme-icon" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)

const MoonIcon = () => (
  <svg className="theme-icon" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

interface LoginPageProps {
  onLoginSuccess?: () => void
  onGoToRegister?: () => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const [isDark, setIsDark] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [isDark])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call delay
      const response = await loginUser({
            email: formData.email.trim(),
            password: formData.password,
          });

      // Authenticate user using userStorage
      

      if (response.status== 201) {
        setSubmitStatus("success")
        setSubmitMessage("Welcome Back:"+response.data.name)

        // Reset form
        setFormData({
          email: "",
          password: "",
        })

        // Redirect after success
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess()
          }
        }, 1500)
      } else {
        setSubmitStatus("error")
        setSubmitMessage(response.status)
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Login failed. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleForgotPassword = () => {
    alert("Forgot password functionality would be implemented here!")
  }

  const handleGoToRegister = () => {
    if (onGoToRegister) {
      onGoToRegister()
    }
  }

  // Get all registered users for demo purposes
  const allUsers = userStorage.getAllUsers()

  return (
    <div className="login-page">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="login-header"
      >
        <div className="header-container">
          <motion.div className="header-logo" whileHover={{ scale: 1.05 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="logo-icon"
            >
              <CodeIcon />
            </motion.div>
            <span className="logo-text">CodeMate AI</span>
          </motion.div>

          <motion.button
            onClick={toggleTheme}
            className="theme-toggle"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SunIcon />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoonIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="login-main">
        <motion.div
          className="login-background"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, #06b6d4 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="login-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="login-content">
            {/* Title Section */}
            <motion.div variants={fadeInUp} className="login-title-section">
              <h1 className="login-title">
                Welcome Back to <span className="gradient-text">CodeMate AI</span>
              </h1>
              <p className="login-subtitle">Sign in to your account and continue your AI-powered development journey</p>
            </motion.div>

            {/* Demo Credentials Info */}
            <motion.div variants={fadeInUp} className="demo-info">
              <div className="demo-card">
                <h3 className="demo-title">Available Test Accounts</h3>
                <div className="demo-credentials">
                  {allUsers.map((user, index) => (
                    <div key={user.id} className="demo-field">
                      <div className="demo-user-info">
                        <span className="demo-label">{user.name}</span>
                        <span className="demo-email">{user.email}</span>
                      </div>
                      <span className="demo-value">{user.password}</span>
                    </div>
                  ))}
                </div>
                <p className="demo-note">
                  Use any of these credentials to test login, or create a new account via registration
                </p>
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div variants={fadeInUp} className="login-form-container">
              <form onSubmit={handleSubmit} className="login-form">
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <MailIcon />
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`form-input ${formErrors.email ? "error" : ""}`}
                      autoComplete="email"
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message"
                      >
                        <XIcon />
                        {formErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <LockIcon />
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`form-input password-input ${formErrors.password ? "error" : ""}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {formErrors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message"
                      >
                        <XIcon />
                        {formErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Forgot Password Link */}
                <div className="forgot-password">
                  <button type="button" onClick={handleForgotPassword} className="forgot-link">
                    Forgot your password?
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderIcon />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon />
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`status-message ${submitStatus}`}
                    >
                      {submitStatus === "success" ? <CheckIcon /> : <XIcon />}
                      {submitMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Register Link */}
              <motion.div variants={fadeInUp} className="register-link">
                <p>
                  Don't have an account?{" "}
                  <button type="button" onClick={handleGoToRegister} className="link-button">
                    Create one here
                  </button>
                </p>
              </motion.div>
            </motion.div>

            {/* Additional Features */}
            <motion.div variants={fadeInUp} className="login-features">
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🚀</div>
                  <h3>Fast & Secure</h3>
                  <p>Lightning-fast login with enterprise-grade security</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <h3>Privacy First</h3>
                  <p>Your data is encrypted and protected at all times</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <h3>Instant Access</h3>
                  <p>Get immediate access to all AI-powered features</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
