const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please provide a valid email address" 
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                message: "An account with this email already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from user object before sending response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(201).json({ 
            message: "Account created successfully",
            token, 
            user: userResponse 
        });

    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "An account with this email already exists" 
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: messages.join('. ') 
            });
        }

        res.status(500).json({ 
            message: "Internal server error. Please try again later." 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from user object before sending response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(200).json({ 
            message: "Login successful",
            token, 
            user: userResponse 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Internal server error. Please try again later.' 
        });
    }
};