"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./UserProfilePage.css"

// Icons
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

const CalendarIcon = () => (
  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const EditIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const SaveIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

const AlertCircleIcon = () => (
  <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
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

const ChevronDownIcon = () => (
  <svg className="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

// Types
interface User {
  _id: string
  name: string
  email: string
  role: "Backend" | "Frontend" | "AI Engineer" | "Product Manager" | "Normal"
  createdAt: string
}

interface ProfileFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  role?: string
}

interface UserProfilePageProps {
  onGoBack?: () => void
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onGoBack }) => {
  const [isDark, setIsDark] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // User data state
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const roleOptions = [
    { value: "Backend", label: "Backend Developer", icon: "🔧" },
    { value: "Frontend", label: "Frontend Developer", icon: "🎨" },
    { value: "AI Engineer", label: "AI Engineer", icon: "🤖" },
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

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)

      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - replace with actual API response
      const mockUser: User = {
        _id: "user123",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Frontend",
        createdAt: "2024-01-15T10:30:00Z",
      }

      setUser(mockUser)
      setFormData({
        name: mockUser.name,
        email: mockUser.email,
        password: "",
        confirmPassword: "",
        role: mockUser.role,
      })
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setSubmitStatus("error")
      setSubmitMessage("Failed to load user profile")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSubmitStatus("idle")
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
        role: user.role,
      })
    }
    setIsEditing(false)
    setFormErrors({})
    setSubmitStatus("idle")
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
    }

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Please select a role"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
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

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    setSubmitStatus("idle")

    try {
      // Prepare update data
      const updateData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      }

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password
      }

      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock API response
      const updatedUser: User = {
        ...user!,
        name: updateData.name,
        email: updateData.email,
        role: updateData.role,
      }

      setUser(updatedUser)
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }))
      setIsEditing(false)
      setSubmitStatus("success")
      setSubmitMessage("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      setSubmitStatus("error")
      setSubmitMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRoleIcon = (role: string) => {
    const roleOption = roleOptions.find((option) => option.value === role)
    return roleOption?.icon || "👤"
  }

  const getRoleLabel = (role: string) => {
    const roleOption = roleOptions.find((option) => option.value === role)
    return roleOption?.label || role
  }

  const selectedRole = roleOptions.find((role) => role.value === formData.role)

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="profile-header"
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
            <span className="logo-text">CodeAI</span>
          </motion.div>

          <div className="header-actions">
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

            {onGoBack && (
              <motion.button
                onClick={onGoBack}
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Dashboard
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="profile-content">
            {/* Title Section */}
            <motion.div variants={fadeInUp} className="profile-title-section">
              <h1 className="profile-title">
                User <span className="gradient-text">Profile</span>
              </h1>
              <p className="profile-subtitle">Manage your account information and preferences</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div variants={fadeInUp} className="profile-card">
              {/* Profile Header */}
              <div className="profile-card-header">
                <div className="profile-avatar-section">
                  <div className="profile-avatar">
                    <UserIcon />
                  </div>
                  <div className="profile-basic-info">
                    <h2 className="profile-name">{user?.name}</h2>
                    <div className="profile-role">
                      <span className="role-icon">{getRoleIcon(user?.role || "")}</span>
                      <span className="role-text">{getRoleLabel(user?.role || "")}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  {!isEditing ? (
                    <motion.button
                      onClick={handleEdit}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <EditIcon />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="edit-actions">
                      <motion.button
                        onClick={handleCancel}
                        className="btn-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XIcon />
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSaving ? (
                          <>
                            <LoaderIcon />
                            Saving...
                          </>
                        ) : (
                          <>
                            <SaveIcon />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="profile-form-section">
                {!isEditing ? (
                  // View Mode
                  <div className="profile-view">
                    <div className="profile-field">
                      <div className="field-label">
                        <UserIcon />
                        Full Name
                      </div>
                      <div className="field-value">{user?.name}</div>
                    </div>

                    <div className="profile-field">
                      <div className="field-label">
                        <MailIcon />
                        Email Address
                      </div>
                      <div className="field-value">{user?.email}</div>
                    </div>

                    <div className="profile-field">
                      <div className="field-label">
                        <BriefcaseIcon />
                        Role
                      </div>
                      <div className="field-value">
                        <span className="role-badge">
                          <span className="role-icon">{getRoleIcon(user?.role || "")}</span>
                          {getRoleLabel(user?.role || "")}
                        </span>
                      </div>
                    </div>

                    <div className="profile-field">
                      <div className="field-label">
                        <CalendarIcon />
                        Member Since
                      </div>
                      <div className="field-value">{user?.createdAt ? formatDate(user.createdAt) : "N/A"}</div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form className="profile-edit-form">
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
                            <AlertCircleIcon />
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
                            <AlertCircleIcon />
                            {formErrors.email}
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
                            <AlertCircleIcon />
                            {formErrors.role}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password Section */}
                    <div className="password-section">
                      <h3 className="section-title">Change Password (Optional)</h3>
                      <p className="section-description">Leave blank to keep your current password</p>

                      {/* New Password Field */}
                      <div className="form-group">
                        <label htmlFor="password" className="form-label">
                          <LockIcon />
                          New Password
                        </label>
                        <div className="input-wrapper">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
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
                        <AnimatePresence>
                          {formErrors.password && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="error-message"
                            >
                              <AlertCircleIcon />
                              {formErrors.password}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Confirm Password Field */}
                      {formData.password && (
                        <div className="form-group">
                          <label htmlFor="confirmPassword" className="form-label">
                            <LockIcon />
                            Confirm New Password
                          </label>
                          <div className="input-wrapper">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              className={`form-input password-input ${formErrors.confirmPassword ? "error" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="password-toggle-btn"
                            >
                              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                          </div>
                          <AnimatePresence>
                            {formErrors.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="error-message"
                              >
                                <AlertCircleIcon />
                                {formErrors.confirmPassword}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </form>
                )}

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
                      {submitStatus === "success" ? <CheckIcon /> : <AlertCircleIcon />}
                      {submitMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div variants={fadeInUp} className="account-info-card">
              <h3 className="card-title">Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">User ID</span>
                  <span className="info-value">{user?._id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Status</span>
                  <span className="info-value">
                    <span className="status-badge active">Active</span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Updated</span>
                  <span className="info-value">Just now</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default UserProfilePage
