// Secure Authentication System for HLC Academy
// This handles user registration, login, and password management

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthSystem {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
        this.bcryptRounds = 12; // High security for password hashing
    }

    // Hash password securely
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(this.bcryptRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            throw new Error('Password hashing failed');
        }
    }

    // Verify password
    async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            throw new Error('Password verification failed');
        }
    }

    // Generate JWT token
    generateToken(userId, email) {
        const payload = {
            userId: userId,
            email: email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };
        
        return jwt.sign(payload, this.jwtSecret);
    }

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    // Generate secure random string for password reset
    generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            requirements: {
                minLength: password.length >= minLength,
                hasUpperCase,
                hasLowerCase,
                hasNumbers,
                hasSpecialChar
            }
        };
    }

    // Sanitize user input
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .substring(0, 1000); // Limit length
    }
}

// User Registration Handler
async function registerUser(userData, db) {
    const auth = new AuthSystem();
    
    try {
        // Validate input
        if (!auth.validateEmail(userData.email)) {
            throw new Error('Invalid email format');
        }

        const passwordValidation = auth.validatePassword(userData.password);
        if (!passwordValidation.isValid) {
            throw new Error('Password does not meet requirements');
        }

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [userData.email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await auth.hashPassword(userData.password);

        // Create user
        const result = await db.query(`
            INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, created_at
        `, [
            userData.email.toLowerCase(),
            hashedPassword,
            auth.sanitizeInput(userData.firstName),
            auth.sanitizeInput(userData.lastName)
        ]);

        const user = result.rows[0];

        // Generate JWT token
        const token = auth.generateToken(user.id, user.email);

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                createdAt: user.created_at
            },
            token: token
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// User Login Handler
async function loginUser(email, password, db) {
    const auth = new AuthSystem();
    
    try {
        // Find user
        const result = await db.query(`
            SELECT id, email, password_hash, first_name, last_name, subscription_status
            FROM users 
            WHERE email = $1
        `, [email.toLowerCase()]);

        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await auth.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        // Generate JWT token
        const token = auth.generateToken(user.id, user.email);

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                subscriptionStatus: user.subscription_status
            },
            token: token
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const auth = new AuthSystem();
    
    try {
        const decoded = auth.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = {
    AuthSystem,
    registerUser,
    loginUser,
    authenticateToken
};
