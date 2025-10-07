// OLD CODE (commented out for reference):
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const userModel = require('../models/user.model');
// async function registerController(req, res) {
//     const { username, password } = req.body;
//     // ... rest of old code
// }

// NEW CODE (production-level with email support):
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function registerController(req, res) {
    try {
        console.log('Register request body:', req.body);
        
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Username, email, and password are required' 
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'Email already registered' });
            }
            if (existingUser.username === username) {
                return res.status(409).json({ message: 'Username already taken' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
}

async function loginController(req, res) {
    try {
        console.log('Login request body:', req.body);
        
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
}

module.exports = {
    registerController,
    loginController
};