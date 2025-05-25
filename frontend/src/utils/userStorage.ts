// Simple in-memory user storage (in a real app, this would be a database)
interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  createdAt: Date
}

class UserStorage {
  private users: User[] = []

  // Add a default demo user
  constructor() {
    this.users.push({
      id: "demo-user",
      name: "Demo User",
      email: "demo@codeai.com",
      password: "Demo123!",
      role: "frontend",
      createdAt: new Date(),
    })
  }

  // Register a new user
  registerUser(userData: Omit<User, "id" | "createdAt">): { success: boolean; message: string; user?: User } {
    // Check if email already exists
    const existingUser = this.users.find((user) => user.email.toLowerCase() === userData.email.toLowerCase())

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists. Please use a different email or try logging in.",
      }
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date(),
    }

    this.users.push(newUser)

    return {
      success: true,
      message: "Account created successfully!",
      user: newUser,
    }
  }

  // Authenticate user login
  authenticateUser(email: string, password: string): { success: boolean; message: string; user?: User } {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (user) {
      return {
        success: true,
        message: `Welcome back, ${user.name}!`,
        user,
      }
    }

    return {
      success: false,
      message: "Invalid email or password. Please check your credentials and try again.",
    }
  }

  // Get user by email
  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  // Get all users (for debugging)
  getAllUsers(): User[] {
    return this.users
  }

  // Check if email exists
  emailExists(email: string): boolean {
    return this.users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }
}

// Create a singleton instance
export const userStorage = new UserStorage()
export type { User }
