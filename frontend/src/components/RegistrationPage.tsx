"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { userStorage } from "../utils/userStorage"
import "./RegistrationPage.css"
import { registerUser } from "../api/auth";


// Icons (keeping all the existing icons)
const UserIcon = () => (
  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

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

const BriefcaseIcon = () => (
  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V8"
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

const ChevronDownIcon = () => (
  <svg className="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
  name: string
  email: string
  password: string
  role: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  role?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
}

interface RegistrationPageProps {
  onRegistrationSuccess?: () => void
  onGoToLogin?: () => void
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegistrationSuccess, onGoToLogin }) => {
  const [isDark, setIsDark] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] })

  const roleOptions = [
    { value: "Backend", label: "Backend Developer", icon: "🔧" },
    { value: "Frontend", label: "Frontend Developer", icon: "🎨" },
    { value: "AI Engineer'", label: "AI Engineer", icon: "🤖" },
    { value: "Product Manager", label: "Product Manager", icon: "📊" },
    { value: "Normal", label: "Normal User", icon: "👤" },
  ]

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [isDark])

  // Password strength calculation
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [formData.password])

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Include lowercase letters")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Include uppercase letters")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("Include numbers")
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push("Include special characters")
    }

    return { score, feedback }
  }

  const getPasswordStrengthLabel = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return "Very Weak"
      case 2:
        return "Weak"
      case 3:
        return "Fair"
      case 4:
        return "Good"
      case 5:
        return "Strong"
      default:
        return "Very Weak"
    }
  }

  const getPasswordStrengthColor = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return "strength-very-weak"
      case 2:
        return "strength-weak"
      case 3:
        return "strength-fair"
      case 4:
        return "strength-good"
      case 5:
        return "strength-strong"
      default:
        return "strength-very-weak"
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    } else if (userStorage.emailExists(formData.email)) {
      errors.email = "An account with this email already exists"
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required"
    } else if (passwordStrength.score < 3) {
      errors.password = "Password is too weak"
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Please select a role"
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

  const handleRoleSelect = (role: string) => {
    handleInputChange("role", role)
    setIsDropdownOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus("idle");

  try {
    // Call backend API
    const response = await registerUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    });

    if (response.status === 201) {
      setSubmitStatus("success");
      setSubmitMessage(`Welcome to CodeMate AI, ${response.data.name}! Your account has been created successfully.`);

      setFormData({ name: "", email: "", password: "", role: "" });

      setTimeout(() => {
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
      }, 2000);
    } else {
      setSubmitStatus("error");
      setSubmitMessage("Registration failed. Please try again.");
    }
  } catch (error: any) {
    setSubmitStatus("error");
    // Show backend error message if available
    setSubmitMessage(error.response?.data?.message || "Registration failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const selectedRole = roleOptions.find((role) => role.value === formData.role)

  return (
    <div className="registration-page">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="registration-header"
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
      <main className="registration-main">
        <motion.div
          className="registration-background"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, #06b6d4 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="registration-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="registration-content">
            {/* Title Section */}
            <motion.div variants={fadeInUp} className="registration-title-section">
              <h1 className="registration-title">
                Join <span className="gradient-text">CodeMate AI</span>
              </h1>
              <p className="registration-subtitle">
                Create your account and start your journey with AI-powered code analysis
              </p>
            </motion.div>

            {/* Registration Form */}
            <motion.div variants={fadeInUp} className="registration-form-container">
              <form onSubmit={handleSubmit} className="registration-form">
                {/* Name Field */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <UserIcon />
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`form-input ${formErrors.name ? "error" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message"
                      >
                        <XIcon />
                        {formErrors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`form-input password-input ${formErrors.password ? "error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="password-strength"
                    >
                      <div className="strength-bar">
                        <div className={`strength-fill ${getPasswordStrengthColor(passwordStrength.score)}`} />
                      </div>
                      <div className="strength-info">
                        <span className={`strength-label ${getPasswordStrengthColor(passwordStrength.score)}`}>
                          {getPasswordStrengthLabel(passwordStrength.score)}
                        </span>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="strength-feedback">
                            {passwordStrength.feedback.map((feedback, index) => (
                              <span key={index} className="feedback-item">
                                {feedback}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

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

                {/* Role Field */}
                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    <BriefcaseIcon />
                    Role <span className="required">*</span>
                  </label>
                  <div className="dropdown-wrapper">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`dropdown-trigger ${formErrors.role ? "error" : ""} ${formData.role ? "selected" : ""}`}
                    >
                      {selectedRole ? (
                        <span className="selected-role">
                          <span className="role-icon">{selectedRole.icon}</span>
                          {selectedRole.label}
                        </span>
                      ) : (
                        <span className="placeholder">Select your role</span>
                      )}
                      <ChevronDownIcon />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="dropdown-menu"
                        >
                          {roleOptions.map((role) => (
                            <motion.button
                              key={role.value}
                              type="button"
                              onClick={() => handleRoleSelect(role.value)}
                              className={`dropdown-item ${formData.role === role.value ? "selected" : ""}`}
                              whileHover={{ backgroundColor: "var(--bg-secondary)" }}
                            >
                              <span className="role-icon">{role.icon}</span>
                              <span className="role-label">{role.label}</span>
                              {formData.role === role.value && <CheckIcon />}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {formErrors.role && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message"
                      >
                        <XIcon />
                        {formErrors.role}
                      </motion.p>
                    )}
                  </AnimatePresence>
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
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

              {/* Login Link */}
              <motion.div variants={fadeInUp} className="login-link">
                <p>
                  Already have an account?{" "}
                  <button type="button" onClick={() => onGoToLogin && onGoToLogin()} className="link-button">
                    Sign in here
                  </button>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default RegistrationPage
