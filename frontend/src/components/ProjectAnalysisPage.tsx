"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./ProjectAnalysisPage.css"
import { addProject } from "../api/auth"

// Icons
const GithubIcon = () => (
  <svg className="form-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

const DiagramIcon = () => (
  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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

const AnalyzeIcon = () => (
  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
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
  githubLink: string
  role: string
  generateDiagram: boolean
}

interface FormErrors {
  githubLink?: string
  role?: string
}

interface ProjectAnalysisPageProps {
  onAnalysisComplete?: (data: FormData) => void
  onGoBack?: () => void
}

const ProjectAnalysisPage: React.FC<ProjectAnalysisPageProps> = ({ onAnalysisComplete, onGoBack }) => {
  const [isDark, setIsDark] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const [formData, setFormData] = useState<FormData>({
    githubLink: "",
    role: "",
    generateDiagram: false,
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const roleOptions = [
    { value: "Frontend", label: "Frontend Developer", icon: "🎨" },
    { value: "Backend", label: "Backend Developer", icon: "🔧" },
    { value: "AI Engineer", label: "AI Engineer", icon: "🤖" },
    { value: "Product Manager", label: "Product Manager", icon: "📊" },
  ]

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [isDark])

  const validateGithubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w\-.]+\/[\w\-.]+\/?$/
    return githubRegex.test(url)
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // GitHub link validation
    if (!formData.githubLink.trim()) {
      errors.githubLink = "GitHub repository link is required"
    } else if (!validateGithubUrl(formData.githubLink.trim())) {
      errors.githubLink = "Please enter a valid GitHub repository URL"
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Please select your role"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleRoleSelect = (role: string) => {
    handleInputChange("role", role)
    setIsDropdownOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      // Prepare the data to send to the API
      const projectData = {
        githubLink: formData.githubLink.trim(),
        role: formData.role,
        // Include generateDiagram if your API supports it
        generateDiagram: formData.generateDiagram
      }

      console.log("Submitting project data:", projectData)

      // Call the addProject function
      const response = await addProject(projectData)
      
      console.log("API response:", response)

      setSubmitStatus("success")
      setSubmitMessage("Analysis started! Redirecting to results...")

      // Redirect after success
      setTimeout(() => {
        if (onAnalysisComplete) {
          onAnalysisComplete(formData)
        }
      }, 1500)

    } catch (error) {
      console.error("Error submitting project:", error)
      
      setSubmitStatus("error")
      
      // Handle different types of errors
      if (error instanceof Error) {
        setSubmitMessage(`Analysis failed: ${error.message}`)
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setSubmitMessage(`Analysis failed: ${(error as any).message}`)
      } else {
        setSubmitMessage("Analysis failed. Please check your connection and try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const selectedRole = roleOptions.find((role) => role.value === formData.role)

  return (
    <div className="project-analysis-page">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="analysis-header"
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
      <main className="analysis-main">
        <motion.div
          className="analysis-background"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, #06b6d4 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="analysis-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="analysis-content">
            {/* Title Section */}
            <motion.div variants={fadeInUp} className="analysis-title-section">
              <h1 className="analysis-title">
                <span className="gradient-text">AI-Powered</span> Project Analysis
              </h1>
              <p className="analysis-subtitle">
                Submit your GitHub repository for comprehensive code analysis and insights
              </p>
            </motion.div>

            {/* Analysis Form */}
            <motion.div variants={fadeInUp} className="analysis-form-container">
              <div className="form-header">
                <h2 className="form-title">Repository Analysis Request</h2>
                <p className="form-subtitle">
                  Provide your GitHub repository details and preferences for a customized analysis
                </p>
              </div>

              <form onSubmit={handleSubmit} className="analysis-form">
                {/* GitHub Link Field */}
                <div className="form-group">
                  <label htmlFor="githubLink" className="form-label">
                    <GithubIcon />
                    GitHub Repository URL <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="githubLink"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={formData.githubLink}
                      onChange={(e) => handleInputChange("githubLink", e.target.value)}
                      className={`form-input ${formErrors.githubLink ? "error" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {formErrors.githubLink && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message"
                      >
                        <XIcon />
                        {formErrors.githubLink}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Role Field */}
                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    <BriefcaseIcon />
                    Your Role <span className="required">*</span>
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

                {/* Diagram Generation Checkbox */}
                <div className="form-group">
                  <div className="checkbox-wrapper">
                    <motion.label className="checkbox-label" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <input
                        type="checkbox"
                        checked={formData.generateDiagram}
                        onChange={(e) => handleInputChange("generateDiagram", e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom">{formData.generateDiagram && <CheckIcon />}</span>
                      <div className="checkbox-content">
                        <div className="checkbox-icon">
                          <DiagramIcon />
                        </div>
                        <div className="checkbox-text">
                          <span className="checkbox-title">Generate Architecture Diagram</span>
                          <span className="checkbox-description">
                            Create visual diagrams showing your project's architecture and component relationships
                          </span>
                        </div>
                      </div>
                    </motion.label>
                  </div>
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
                      Analyzing Repository...
                    </>
                  ) : (
                    <>
                      <AnalyzeIcon />
                      Start Analysis
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
            </motion.div>

            {/* Features Preview */}
            <motion.div variants={fadeInUp} className="features-preview">
              <h3 className="features-title">What You'll Get</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <h4>Code Quality Analysis</h4>
                  <p>Comprehensive analysis of code quality, complexity, and maintainability</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔍</div>
                  <h4>Security Insights</h4>
                  <p>Identify potential security vulnerabilities and best practice violations</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <h4>Performance Recommendations</h4>
                  <p>Suggestions for optimizing performance and reducing technical debt</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏗️</div>
                  <h4>Architecture Diagrams</h4>
                  <p>Visual representation of your project structure and dependencies</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default ProjectAnalysisPage