"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./LandingPage.css"

// Icons as React components
const SunIcon = () => (
  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)

const MoonIcon = () => (
  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className="star-icon" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const CodeIcon = () => (
  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const ZapIcon = () => (
  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const UsersIcon = () => (
  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const MailIcon = () => (
  <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const SendIcon = () => (
  <svg className="tiny-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="tiny-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const AlertCircleIcon = () => (
  <svg className="tiny-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const LoaderIcon = () => (
  <svg className="tiny-icon spinner" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const GithubIcon = () => (
  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const HistoryIcon = () => (
  <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const UserProfileIcon = () => (
  <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

interface LandingPageProps {
  onGoToLogin?: () => void
  onGoToRegister?: () => void
  onGoToAnalysis?: () => void
  onGoToHistory?: () => void
  onGoToProfile?: () => void
}

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToRegister,
  onGoToAnalysis,
  onGoToHistory,
  onGoToProfile,
}) => {
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [activeSection, setActiveSection] = useState("home")

  // Contact form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleLogin = () => {
    if (onGoToLogin) {
      onGoToLogin()
    } else {
      alert("Login functionality would be implemented here!")
    }
  }

  const handleGetStarted = () => {
    if (onGoToAnalysis) {
      onGoToAnalysis()
    } else {
      alert("Welcome! Sign up process would start here.")
    }
  }

  const handleViewHistory = () => {
    if (onGoToHistory) {
      onGoToHistory()
    } else {
      alert("History functionality would be implemented here!")
    }
  }

  const handleViewProfile = () => {
    if (onGoToProfile) {
      onGoToProfile()
    } else {
      alert("Profile functionality would be implemented here!")
    }
  }

  const handleRating = (value: number) => {
    setRating(value)
    alert(`Thank you for rating us ${value} star${value !== 1 ? "s" : ""}!`)
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters"
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (formErrors[field as keyof FormErrors]) {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitStatus("success")
      setSubmitMessage("Thank you for your message! We'll get back to you within 24 hours.")
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Sorry, there was an error sending your message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    {
      icon: CodeIcon,
      title: "Smart Code Analysis",
      description:
        "AI-powered code analysis that understands your codebase structure and provides intelligent insights.",
      color: "blue-gradient",
    },
    {
      icon: ZapIcon,
      title: "Lightning Fast",
      description: "Optimized performance with instant results. Get your analysis in seconds, not minutes.",
      color: "yellow-gradient",
    },
    {
      icon: ShieldIcon,
      title: "Secure & Private",
      description: "Your code stays private. We use enterprise-grade security to protect your intellectual property.",
      color: "green-gradient",
    },
    {
      icon: UsersIcon,
      title: "Team Collaboration",
      description: "Share insights with your team. Built-in collaboration tools for better code understanding.",
      color: "purple-gradient",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer",
      company: "TechCorp",
      content: "This tool has revolutionized how we understand and maintain our codebase. Absolutely incredible!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      role: "CTO",
      company: "StartupXYZ",
      content: "The AI insights have helped us identify bottlenecks we never knew existed. Game changer!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Emily Davis",
      role: "Tech Lead",
      company: "InnovateLab",
      content: "Our team productivity increased by 40% after implementing this solution. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    },
  ]

  return (
    <div className="landing-page">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="navbar"
      >
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <motion.div className="logo" whileHover={{ scale: 1.05 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="logo-icon"
              >
                <CodeIcon />
              </motion.div>
              <span className="logo-text">CodeAI</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="nav-links">
              {["Home", "Features", "About", "Contact"].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`nav-link ${activeSection === item.toLowerCase() ? "active" : ""}`}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="nav-actions">
              <motion.button onClick={toggleTheme} className="theme-toggle" {...scaleOnHover}>
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

              <motion.button onClick={handleViewProfile} className="btn-secondary" {...scaleOnHover}>
                <UserProfileIcon />
                Profile
              </motion.button>

              <motion.button onClick={handleViewHistory} className="btn-secondary" {...scaleOnHover}>
                <HistoryIcon />
                History
              </motion.button>

              <motion.button onClick={handleLogin} className="btn-secondary" {...scaleOnHover}>
                Login
              </motion.button>

              <motion.button onClick={handleGetStarted} className="btn-primary" {...scaleOnHover}>
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-nav">
              <button onClick={toggleTheme} className="theme-toggle">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-toggle">
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-menu"
            >
              <div className="mobile-menu-content">
                {["Home", "Features", "About", "Contact"].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="mobile-nav-link">
                    {item}
                  </button>
                ))}
                <div className="mobile-actions">
                  <button onClick={handleViewProfile} className="btn-secondary">
                    Profile
                  </button>
                  <button onClick={handleViewHistory} className="btn-secondary">
                    History
                  </button>
                  <button onClick={handleLogin} className="btn-secondary">
                    Login
                  </button>
                  <button onClick={handleGetStarted} className="btn-primary">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <motion.div
          className="hero-background"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, #06b6d4 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="hero-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="hero-content">
            <motion.h1 variants={fadeInUp} className="hero-title">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Code Analysis
            </motion.h1>

            <motion.p variants={fadeInUp} className="hero-description">
              Transform your development workflow with intelligent code insights, automated documentation, and smart
              recommendations powered by cutting-edge AI technology.
            </motion.p>

            <motion.div variants={fadeInUp} className="hero-actions">
              <motion.button onClick={handleGetStarted} className="btn-primary btn-large" {...scaleOnHover}>
                Start Free Trial
                <ArrowRightIcon />
              </motion.button>

              <motion.button
                onClick={() => scrollToSection("features")}
                className="btn-secondary btn-large"
                {...scaleOnHover}
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} className="hero-dots">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Number.POSITIVE_INFINITY }}
                  className="dot"
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="section-title"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="section-description"
            >
              Everything you need to understand, optimize, and maintain your codebase with confidence.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="features-grid"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="feature-card">
                  <div className="feature-content">
                    <motion.div
                      className={`feature-icon-wrapper ${feature.color}`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon />
                    </motion.div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Rate Us Section */}
      <section className="rating-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rating-content"
          >
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="section-title"
            >
              Rate Your Experience
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="section-description"
            >
              We value your feedback! Help us improve by rating your experience with our platform.
            </motion.p>

            <motion.div
              className="stars-container"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  variants={fadeInUp}
                  className="star-button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRating(star)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{
                      color: hoveredRating >= star || rating >= star ? "#fbbf24" : "var(--text-muted)",
                      scale: hoveredRating >= star || rating >= star ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <StarIcon filled={hoveredRating >= star || rating >= star} />
                  </motion.div>
                </motion.button>
              ))}
            </motion.div>

            {rating > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rating-feedback">
                <p className="rating-thanks">Thank you for your {rating}-star rating!</p>
                <p className="rating-message">Your feedback helps us improve our service.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-grid"
          >
            <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <motion.h2 variants={fadeInUp} className="section-title">
                About CodeAI
              </motion.h2>
              <motion.p variants={fadeInUp} className="about-text">
                We're a team of passionate developers and AI researchers dedicated to revolutionizing how developers
                understand and work with code. Our mission is to make complex codebases accessible and maintainable for
                teams of all sizes.
              </motion.p>
              <motion.p variants={fadeInUp} className="about-text">
                Founded in 2024, we've helped thousands of developers save time, reduce bugs, and improve code quality
                through our AI-powered analysis tools.
              </motion.p>

              <motion.div variants={fadeInUp} className="stats-grid">
                {[
                  { number: "10K+", label: "Developers" },
                  { number: "500+", label: "Companies" },
                  { number: "1M+", label: "Lines Analyzed" },
                ].map((stat, index) => (
                  <div key={index} className="stat-item">
                    <motion.div
                      className="stat-number"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="testimonials-grid"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="testimonial-card"
                >
                  <div className="testimonial-header">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="testimonial-avatar"
                    />
                    <div>
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-role">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section id="contact" className="contact-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <motion.h2
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="section-title"
            >
              Get In Touch
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="section-description"
            >
              Have questions or want to learn more? We'd love to hear from you!
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="contact-form-container">
              <div className="contact-form-header">
                <h3 className="contact-form-title">
                  <MailIcon />
                  Contact Us
                </h3>
                <p className="contact-form-subtitle">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Name <span className="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`form-input ${formErrors.name ? "error" : ""}`}
                    />
                    {formErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="error-message"
                      >
                        <AlertCircleIcon />
                        {formErrors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`form-input ${formErrors.email ? "error" : ""}`}
                    />
                    {formErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="error-message"
                      >
                        <AlertCircleIcon />
                        {formErrors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Company Field */}
                <div className="form-group">
                  <label htmlFor="company" className="form-label">
                    Company (Optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Subject Field */}
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject <span className="required">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className={`form-input ${formErrors.subject ? "error" : ""}`}
                  />
                  {formErrors.subject && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message">
                      <AlertCircleIcon />
                      {formErrors.subject}
                    </motion.p>
                  )}
                </div>

                {/* Message Field */}
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className={`form-textarea ${formErrors.message ? "error" : ""}`}
                  />
                  {formErrors.message && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message">
                      <AlertCircleIcon />
                      {formErrors.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button type="submit" disabled={isSubmitting} className="submit-button" {...scaleOnHover}>
                  {isSubmitting ? (
                    <>
                      <LoaderIcon />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon />
                      Send Message
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
                      {submitStatus === "success" ? <CheckCircleIcon /> : <AlertCircleIcon />}
                      {submitMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="social-section"
          >
            <p className="social-text">Or connect with us on social media</p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="social-links"
            >
              {[
                { icon: GithubIcon, label: "GitHub" },
                { icon: TwitterIcon, label: "Twitter" },
                { icon: LinkedinIcon, label: "LinkedIn" },
              ].map((social, index) => (
                <motion.button
                  key={social.label}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="social-button"
                  onClick={() => alert(`${social.label} link would be implemented here!`)}
                >
                  <social.icon />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="footer-content"
          >
            <div className="footer-logo">
              <div className="logo-icon">
                <CodeIcon />
              </div>
              <span className="logo-text">CodeAI</span>
            </div>
            <p className="footer-text">© 2024 CodeAI. All rights reserved. Made with ❤️ for developers.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
