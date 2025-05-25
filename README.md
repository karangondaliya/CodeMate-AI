# CodeMate AI

<!--<p align="center">
  <img src="https://via.placeholder.com/150?text=CodeMate" alt="CodeMate AI Logo"/>
</p>-->

<p align="center">
  <b>AI-powered code analysis and software architecture visualization tool</b>
</p>

## 🚀 Overview

CodeMate AI is a powerful web application that leverages AI to analyze GitHub repositories and generate comprehensive code insights, summaries, and software architecture diagrams. Built with a modern tech stack featuring Express.js backend, FastAPI for AI integration, and React frontend, CodeMate AI helps developers understand codebases faster and better visualize software architecture.

## ✨ Features

- **Repository Analysis**: Analyze any public GitHub repository for code quality, structure, and architecture
- **Role-based Insights**: Get tailored insights based on your role (Backend, Frontend, AI Engineer, Product Manager)
- **Architecture Diagrams**: Generate Mermaid.js diagrams that visualize your project's structure
  - Class Diagrams
  - Sequence Diagrams
  - ER Diagrams
  - Use Case Diagrams
- **Customized Summaries**: Get role-specific summaries of codebases
- **Project History**: Track all your past analyses

## 🛠️ Tech Stack

### Backend
- **Express.js**: Main backend API handling authentication, project management, and data persistence
- **MongoDB**: Database storage for users, projects, and analysis history
- **JWT**: Authentication and authorization
- **Axios**: API communication with FastAPI service

### AI Service
- **FastAPI**: Python-based API service for AI processing
- **RAG (Retrieval-Augmented Generation)**: Enhanced AI responses with context from the repository
- **Gemini AI**: Powers diagram generation 
- **Groq LLM**: Powers code summarization
- **Embedding Models**: Semantic understanding of code

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Framer Motion**: Animations
- **CSS**: Custom styling

## 🔧 System Architecture

The system follows a microservices architecture with two main components:

1. **Express Backend**:
   - Handles user authentication
   - Manages user profiles
   - Tracks project history
   - Acts as the API for frontend communication

2. **FastAPI Service**:
   - Clones GitHub repositories
   - Analyzes code using AI models
   - Generates architecture diagrams
   - Provides code summaries

## 🏗️ Project Structure

```
project-root/
├── frontend/                # React + TypeScript frontend
├── backend/                 # Express.js backend
│   ├── config/              # Database configuration
│   ├── controllers/         # API route controllers
│   ├── middleware/          # Auth middleware
│   ├── models/              # MongoDB models
│   └── routes/              # API routes
└── fastapi-service/         # Python FastAPI service
    ├── app/                 # FastAPI application
    │   ├── summarize.py     # Repository summarization logic
    │   └── diagram_generator.py # Diagram generation logic
    └── main.py              # FastAPI entry point
```

## 🔄 Workflow

1. User authenticates via the Express backend
2. User submits a GitHub repository URL for analysis
3. Express backend sends the request to the FastAPI service
4. FastAPI service:
   - Clones the repository
   - Analyzes the code using AI models
   - Generates diagrams based on role and request
   - Returns summaries and diagrams
5. Express backend stores the results in MongoDB
6. User views the results in the frontend dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ for Express backend
- Python 3.8+ for FastAPI service
- MongoDB
- API keys for Groq and Gemini AI

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/codemate-ai.git
cd codemate-ai
```

**2. Set up the Express backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

**3. Set up the FastAPI service**
```bash
cd ../fastapi-service
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

**4. Set up the React frontend**
```bash
cd ../frontend
npm install
```

**5. Start the services**
```bash
# In separate terminals:

# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start FastAPI
cd fastapi-service
uvicorn main:app --reload

# Terminal 3 - Start frontend
cd frontend
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Groq](https://groq.com/) - For providing the LLM API
- [Google Gemini](https://deepmind.google/technologies/gemini/) - For powering diagram generation
- [Mermaid.js](https://mermaid-js.github.io/) - For diagram syntax and rendering

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/karangondaliya">Karan Gondaliya</a>
</p>
