"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./HistoryPage.css"

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

const SearchIcon = () => (
  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const FilterIcon = () => (
  <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const FolderIcon = () => (
  <svg className="folder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
)

const GitBranchIcon = () => (
  <svg className="git-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const BarChartIcon = () => (
  <svg className="chart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const EyeIcon = () => (
  <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg className="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
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

// Types
interface Project {
  _id: string
  name: string
  description: string
  githubUrl: string
}

interface HistoryItem {
  _id: string
  user: string
  project: Project
  action: "Created" | "Updated" | "Analyzed"
  timestamp: Date
  details?: {
    codeQuality?: number
    securityScore?: number
    performanceScore?: number
    linesOfCode?: number
    filesAnalyzed?: number
  }
}

interface HistoryPageProps {
  onGoBack?: () => void
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onGoBack }) => {
  const [isDark, setIsDark] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with actual API call
  const mockHistoryData: HistoryItem[] = [
    {
      _id: "1",
      user: "john.doe@example.com",
      project: {
        _id: "proj1",
        name: "E-commerce Platform",
        description: "Full-stack React/Node.js e-commerce application",
        githubUrl: "https://github.com/johndoe/ecommerce-platform",
      },
      action: "Analyzed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      details: {
        codeQuality: 8.5,
        securityScore: 7.2,
        performanceScore: 8.1,
        linesOfCode: 15420,
        filesAnalyzed: 127,
      },
    },
    {
      _id: "2",
      user: "john.doe@example.com",
      project: {
        _id: "proj2",
        name: "Task Management App",
        description: "React-based task management application with real-time updates",
        githubUrl: "https://github.com/johndoe/task-manager",
      },
      action: "Created",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      _id: "3",
      user: "john.doe@example.com",
      project: {
        _id: "proj3",
        name: "Weather Dashboard",
        description: "Vue.js weather dashboard with interactive charts",
        githubUrl: "https://github.com/johndoe/weather-dashboard",
      },
      action: "Updated",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      _id: "4",
      user: "john.doe@example.com",
      project: {
        _id: "proj1",
        name: "E-commerce Platform",
        description: "Full-stack React/Node.js e-commerce application",
        githubUrl: "https://github.com/johndoe/ecommerce-platform",
      },
      action: "Updated",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      _id: "5",
      user: "john.doe@example.com",
      project: {
        _id: "proj4",
        name: "Blog CMS",
        description: "Content management system built with Next.js",
        githubUrl: "https://github.com/johndoe/blog-cms",
      },
      action: "Analyzed",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      details: {
        codeQuality: 9.1,
        securityScore: 8.8,
        performanceScore: 7.9,
        linesOfCode: 8750,
        filesAnalyzed: 89,
      },
    },
    {
      _id: "6",
      user: "john.doe@example.com",
      project: {
        _id: "proj5",
        name: "Mobile Banking App",
        description: "React Native banking application with biometric authentication",
        githubUrl: "https://github.com/johndoe/mobile-banking",
      },
      action: "Created",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
  ]

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [isDark])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Filter and search logic
  const filteredHistory = useMemo(() => {
    let filtered = mockHistoryData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.action.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by action
    if (selectedAction !== "all") {
      filtered = filtered.filter((item) => item.action.toLowerCase() === selectedAction.toLowerCase())
    }

    // Filter by time range
    if (selectedTimeRange !== "all") {
      const now = new Date()
      const timeRanges = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
      }

      const range = timeRanges[selectedTimeRange as keyof typeof timeRanges]
      if (range) {
        filtered = filtered.filter((item) => now.getTime() - item.timestamp.getTime() <= range)
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [searchTerm, selectedAction, selectedTimeRange])

  // Statistics
  const stats = useMemo(() => {
    const totalProjects = new Set(mockHistoryData.map((item) => item.project._id)).size
    const totalAnalyses = mockHistoryData.filter((item) => item.action === "Analyzed").length
    const recentActivity = mockHistoryData.filter(
      (item) => Date.now() - item.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000,
    ).length

    return { totalProjects, totalAnalyses, recentActivity }
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "Created":
        return "action-created"
      case "Updated":
        return "action-updated"
      case "Analyzed":
        return "action-analyzed"
      default:
        return "action-default"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Created":
        return <FolderIcon />
      case "Updated":
        return <GitBranchIcon />
      case "Analyzed":
        return <BarChartIcon />
      default:
        return <ClockIcon />
    }
  }

  return (
    <div className="history-page">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="history-header"
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
      <main className="history-main">
        <div className="history-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="history-content">
            {/* Title Section */}
            <motion.div variants={fadeInUp} className="history-title-section">
              <h1 className="history-title">
                Project <span className="gradient-text">History</span>
              </h1>
              <p className="history-subtitle">Track all your project activities, analyses, and updates in one place</p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={fadeInUp} className="stats-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon projects">
                    <FolderIcon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.totalProjects}</div>
                    <div className="stat-label">Total Projects</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon analyses">
                    <BarChartIcon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.totalAnalyses}</div>
                    <div className="stat-label">Analyses Run</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon activity">
                    <ClockIcon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.recentActivity}</div>
                    <div className="stat-label">Recent Activity</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div variants={fadeInUp} className="filters-section">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search projects, actions, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filters-container">
                <div className="filter-group">
                  <FilterIcon />
                  <span className="filter-label">Action:</span>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Actions</option>
                    <option value="created">Created</option>
                    <option value="updated">Updated</option>
                    <option value="analyzed">Analyzed</option>
                  </select>
                </div>

                <div className="filter-group">
                  <ClockIcon />
                  <span className="filter-label">Time:</span>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* History List */}
            <motion.div variants={fadeInUp} className="history-list-section">
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading history...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No history found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="history-list">
                  <AnimatePresence>
                    {filteredHistory.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="history-item"
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="history-item-header">
                          <div className="action-badge-container">
                            <div className={`action-icon ${getActionColor(item.action)}`}>
                              {getActionIcon(item.action)}
                            </div>
                            <span className={`action-badge ${getActionColor(item.action)}`}>{item.action}</span>
                          </div>
                          <div className="timestamp">{formatTimeAgo(item.timestamp)}</div>
                        </div>

                        <div className="history-item-content">
                          <h3 className="project-name">{item.project.name}</h3>
                          <p className="project-description">{item.project.description}</p>

                          {item.details && (
                            <div className="analysis-preview">
                              <div className="score-preview">
                                <span className="score-label">Quality:</span>
                                <span className="score-value">{item.details.codeQuality}/10</span>
                              </div>
                              <div className="score-preview">
                                <span className="score-label">Security:</span>
                                <span className="score-value">{item.details.securityScore}/10</span>
                              </div>
                              <div className="score-preview">
                                <span className="score-label">Performance:</span>
                                <span className="score-value">{item.details.performanceScore}/10</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="history-item-footer">
                          <a
                            href={item.project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLinkIcon />
                            View on GitHub
                          </a>
                          <button className="view-details-btn">
                            <EyeIcon />
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedItem.project.name}</h2>
                <button onClick={() => setSelectedItem(null)} className="modal-close">
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Project Information</h3>
                  <p>
                    <strong>Description:</strong> {selectedItem.project.description}
                  </p>
                  <p>
                    <strong>Action:</strong> {selectedItem.action}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {selectedItem.timestamp.toLocaleString()}
                  </p>
                  <p>
                    <strong>GitHub URL:</strong>
                    <a href={selectedItem.project.githubUrl} target="_blank" rel="noopener noreferrer">
                      {selectedItem.project.githubUrl}
                    </a>
                  </p>
                </div>

                {selectedItem.details && (
                  <div className="detail-section">
                    <h3>Analysis Results</h3>
                    <div className="analysis-details">
                      <div className="detail-metric">
                        <span>Code Quality:</span>
                        <span>{selectedItem.details.codeQuality}/10</span>
                      </div>
                      <div className="detail-metric">
                        <span>Security Score:</span>
                        <span>{selectedItem.details.securityScore}/10</span>
                      </div>
                      <div className="detail-metric">
                        <span>Performance Score:</span>
                        <span>{selectedItem.details.performanceScore}/10</span>
                      </div>
                      <div className="detail-metric">
                        <span>Lines of Code:</span>
                        <span>{selectedItem.details.linesOfCode?.toLocaleString()}</span>
                      </div>
                      <div className="detail-metric">
                        <span>Files Analyzed:</span>
                        <span>{selectedItem.details.filesAnalyzed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HistoryPage
