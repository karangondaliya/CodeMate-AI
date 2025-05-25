"use client"

import { useState } from "react"
import LandingPage from "./components/LandingPage"
import RegistrationPage from "./components/RegistrationPage"
import LoginPage from "./components/LoginPage"
import ProjectAnalysisPage from "./components/ProjectAnalysisPage"
import AnalysisResultsPage from "./components/AnalysisResultsPage"
import HistoryPage from "./components/HistoryPage"
import UserProfilePage from "./components/UserProfilePage"

interface AnalysisData {
  githubLink: string
  role: string
  generateDiagram: boolean
}

function App() {
  const [currentPage, setCurrentPage] = useState<
    "landing" | "registration" | "login" | "analysis" | "results" | "history" | "profile"
  >("login")
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  const handleLoginSuccess = () => {
    setCurrentPage("landing")
  }

  const handleRegistrationSuccess = () => {
    setCurrentPage("landing")
  }

  const showRegistration = () => {
    setCurrentPage("registration")
  }

  const showLogin = () => {
    setCurrentPage("login")
  }

  const showLanding = () => {
    setCurrentPage("landing")
  }

  const showAnalysis = () => {
    setCurrentPage("analysis")
  }

  const showHistory = () => {
    setCurrentPage("history")
  }

  const showProfile = () => {
    setCurrentPage("profile")
  }

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data)
    setCurrentPage("results")
  }

  const showResults = () => {
    setCurrentPage("results")
  }

  const handleNewAnalysis = () => {
    setAnalysisData(null)
    setCurrentPage("analysis")
  }

  return (
    <div className="App">
      {currentPage === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} onGoToRegister={showRegistration} />}
      {currentPage === "registration" && (
        <RegistrationPage onRegistrationSuccess={handleRegistrationSuccess} onGoToLogin={showLogin} />
      )}
      {currentPage === "landing" && (
        <LandingPage
          onGoToLogin={showLogin}
          onGoToRegister={showRegistration}
          onGoToAnalysis={showAnalysis}
          onGoToHistory={showHistory}
          onGoToProfile={showProfile}
        />
      )}
      {currentPage === "analysis" && (
        <ProjectAnalysisPage />
      )}
      {currentPage === "results" && analysisData && (
        <AnalysisResultsPage analysisData={analysisData} onGoBack={showLanding} onNewAnalysis={handleNewAnalysis} />
      )}
      {currentPage === "history" && <HistoryPage onGoBack={showLanding} />}
      {currentPage === "profile" && <UserProfilePage onGoBack={showLanding} />}
    </div>
  )
}

export default App
