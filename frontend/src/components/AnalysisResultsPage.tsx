"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./AnalysisResultsPage.css"

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

const DownloadIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const ShareIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

const XCircleIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const ZapIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const FileTextIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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

interface AnalysisData {
  githubLink: string
  role: string
  generateDiagram: boolean
}

interface AnalysisResultsPageProps {
  analysisData: AnalysisData
  onGoBack?: () => void
  onNewAnalysis?: () => void
}

const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({ analysisData, onGoBack, onNewAnalysis }) => {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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

  // Mock analysis results
  const analysisResults = {
    repository: {
      name: analysisData.githubLink.split("/").pop() || "Unknown Repository",
      url: analysisData.githubLink,
      language: "TypeScript",
      size: "2.4 MB",
      files: 127,
      commits: 342,
    },
    codeQuality: {
      score: 8.5,
      maintainability: 9.2,
      complexity: 7.8,
      testCoverage: 85,
    },
    security: {
      vulnerabilities: {
        critical: 0,
        high: 2,
        medium: 5,
        low: 12,
      },
      securityScore: 7.3,
    },
    performance: {
      score: 8.1,
      suggestions: [
        "Optimize bundle size by removing unused dependencies",
        "Implement lazy loading for route components",
        "Add caching strategies for API calls",
        "Optimize image assets and use modern formats",
      ],
    },
    insights: [
      {
        type: "success",
        title: "Excellent Code Structure",
        description: "Your project follows modern React patterns and has good component organization.",
      },
      {
        type: "warning",
        title: "Bundle Size Optimization",
        description: "Consider code splitting to reduce initial bundle size by ~30%.",
      },
      {
        type: "info",
        title: "Testing Coverage",
        description: "Good test coverage! Consider adding more integration tests.",
      },
    ],
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8) return "bg-green-100 dark:bg-green-900/20"
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FileTextIcon },
    { id: "quality", label: "Code Quality", icon: CheckCircleIcon },
    { id: "security", label: "Security", icon: ShieldIcon },
    { id: "performance", label: "Performance", icon: ZapIcon },
  ]

  return (
    <div className="analysis-results-page">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="results-header"
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

            <motion.button
              onClick={() => alert("Download report functionality would be implemented here!")}
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DownloadIcon />
              Download Report
            </motion.button>

            <motion.button
              onClick={() => alert("Share functionality would be implemented here!")}
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShareIcon />
              Share
            </motion.button>

            {onNewAnalysis && (
              <motion.button
                onClick={onNewAnalysis}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Analysis
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="results-main">
        <div className="results-container">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="results-content">
            {/* Title Section */}
            <motion.div variants={fadeInUp} className="results-title-section">
              <h1 className="results-title">
                Analysis Results for <span className="gradient-text">{analysisResults.repository.name}</span>
              </h1>
              <p className="results-subtitle">
                Comprehensive AI-powered analysis completed for your {analysisData.role} perspective
              </p>
            </motion.div>

            {/* Repository Info */}
            <motion.div variants={fadeInUp} className="repo-info-card">
              <div className="repo-info-header">
                <h2 className="repo-info-title">Repository Information</h2>
                <a
                  href={analysisResults.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-link"
                >
                  View on GitHub →
                </a>
              </div>
              <div className="repo-stats">
                <div className="repo-stat">
                  <span className="stat-label">Language</span>
                  <span className="stat-value">{analysisResults.repository.language}</span>
                </div>
                <div className="repo-stat">
                  <span className="stat-label">Size</span>
                  <span className="stat-value">{analysisResults.repository.size}</span>
                </div>
                <div className="repo-stat">
                  <span className="stat-label">Files</span>
                  <span className="stat-value">{analysisResults.repository.files}</span>
                </div>
                <div className="repo-stat">
                  <span className="stat-label">Commits</span>
                  <span className="stat-value">{analysisResults.repository.commits}</span>
                </div>
              </div>
            </motion.div>

            {/* Score Overview */}
            <motion.div variants={fadeInUp} className="score-overview">
              <h2 className="section-title">Overall Scores</h2>
              <div className="scores-grid">
                <div className="score-card">
                  <div className="score-header">
                    <CheckCircleIcon />
                    <span>Code Quality</span>
                  </div>
                  <div className={`score-value ${getScoreColor(analysisResults.codeQuality.score)}`}>
                    {analysisResults.codeQuality.score}/10
                  </div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${analysisResults.codeQuality.score * 10}%` }} />
                  </div>
                </div>

                <div className="score-card">
                  <div className="score-header">
                    <ShieldIcon />
                    <span>Security</span>
                  </div>
                  <div className={`score-value ${getScoreColor(analysisResults.security.securityScore)}`}>
                    {analysisResults.security.securityScore}/10
                  </div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${analysisResults.security.securityScore * 10}%` }} />
                  </div>
                </div>

                <div className="score-card">
                  <div className="score-header">
                    <ZapIcon />
                    <span>Performance</span>
                  </div>
                  <div className={`score-value ${getScoreColor(analysisResults.performance.score)}`}>
                    {analysisResults.performance.score}/10
                  </div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${analysisResults.performance.score * 10}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={fadeInUp} className="tabs-container">
              <div className="tabs-header">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="tab-content">
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-panel">
                    <h3 className="panel-title">Key Insights</h3>
                    <div className="insights-grid">
                      {analysisResults.insights.map((insight, index) => (
                        <div key={index} className={`insight-card ${insight.type}`}>
                          <div className="insight-header">
                            {insight.type === "success" && <CheckCircleIcon />}
                            {insight.type === "warning" && <AlertTriangleIcon />}
                            {insight.type === "error" && <XCircleIcon />}
                            {insight.type === "info" && <FileTextIcon />}
                            <h4>{insight.title}</h4>
                          </div>
                          <p>{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "quality" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-panel">
                    <h3 className="panel-title">Code Quality Metrics</h3>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-header">
                          <span className="metric-label">Maintainability</span>
                          <span
                            className={`metric-value ${getScoreColor(analysisResults.codeQuality.maintainability)}`}
                          >
                            {analysisResults.codeQuality.maintainability}/10
                          </span>
                        </div>
                        <div className="metric-bar">
                          <div
                            className="metric-fill"
                            style={{ width: `${analysisResults.codeQuality.maintainability * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="metric-card">
                        <div className="metric-header">
                          <span className="metric-label">Complexity</span>
                          <span className={`metric-value ${getScoreColor(analysisResults.codeQuality.complexity)}`}>
                            {analysisResults.codeQuality.complexity}/10
                          </span>
                        </div>
                        <div className="metric-bar">
                          <div
                            className="metric-fill"
                            style={{ width: `${analysisResults.codeQuality.complexity * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="metric-card">
                        <div className="metric-header">
                          <span className="metric-label">Test Coverage</span>
                          <span className="metric-value text-green-600">
                            {analysisResults.codeQuality.testCoverage}%
                          </span>
                        </div>
                        <div className="metric-bar">
                          <div
                            className="metric-fill"
                            style={{ width: `${analysisResults.codeQuality.testCoverage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-panel">
                    <h3 className="panel-title">Security Analysis</h3>
                    <div className="security-overview">
                      <div className="vulnerability-summary">
                        <h4>Vulnerabilities Found</h4>
                        <div className="vulnerability-counts">
                          <div className="vuln-count critical">
                            <span className="vuln-number">{analysisResults.security.vulnerabilities.critical}</span>
                            <span className="vuln-label">Critical</span>
                          </div>
                          <div className="vuln-count high">
                            <span className="vuln-number">{analysisResults.security.vulnerabilities.high}</span>
                            <span className="vuln-label">High</span>
                          </div>
                          <div className="vuln-count medium">
                            <span className="vuln-number">{analysisResults.security.vulnerabilities.medium}</span>
                            <span className="vuln-label">Medium</span>
                          </div>
                          <div className="vuln-count low">
                            <span className="vuln-number">{analysisResults.security.vulnerabilities.low}</span>
                            <span className="vuln-label">Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "performance" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tab-panel">
                    <h3 className="panel-title">Performance Recommendations</h3>
                    <div className="recommendations-list">
                      {analysisResults.performance.suggestions.map((suggestion, index) => (
                        <div key={index} className="recommendation-item">
                          <TrendingUpIcon />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Architecture Diagram */}
            {analysisData.generateDiagram && (
              <motion.div variants={fadeInUp} className="diagram-section">
                <h2 className="section-title">Architecture Diagram</h2>
                <div className="diagram-container">
                  <div className="diagram-placeholder">
                    <div className="diagram-icon">🏗️</div>
                    <h3>Project Architecture</h3>
                    <p>Interactive diagram showing component relationships and data flow</p>
                    <div className="diagram-mock">
                      <div className="component-box frontend">Frontend Components</div>
                      <div className="component-box api">API Layer</div>
                      <div className="component-box database">Database</div>
                      <div className="connection-line line-1"></div>
                      <div className="connection-line line-2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="action-buttons">
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
              {onNewAnalysis && (
                <motion.button
                  onClick={onNewAnalysis}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze Another Repository
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default AnalysisResultsPage
