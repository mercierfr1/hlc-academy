// User Management System
class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            this.currentUser = JSON.parse(loggedInUser);
        }
    }

    // Load all users from localStorage
    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Save all users to localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Register a new user
    registerUser(userData) {
        const { firstName, lastName, email, password } = userData;
        
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser = {
            id: this.generateUserId(),
            firstName,
            lastName,
            email,
            password, // In production, this should be hashed
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                experience: null,
                profitability: null,
                obstacle: null,
                screenTime: null,
                accountSize: null,
                winVision: null,
                phone: null
            },
            progress: {
                overallProgress: 0,
                completedModules: [],
                currentModule: null,
                quizScores: {},
                timeSpent: 0,
                streak: 0,
                lastActivity: new Date().toISOString()
            },
            preferences: {
                notifications: true,
                emailUpdates: true,
                theme: 'light'
            }
        };

        this.users.push(newUser);
        this.saveUsers();
        this.login(newUser.email, password);
        
        return newUser;
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            user.lastLogin = new Date().toISOString();
            this.currentUser = user;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            this.saveUsers();
            return user;
        }
        throw new Error('Invalid email or password');
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('loggedInUser');
    }

    // Update user profile
    updateUserProfile(profileData) {
        if (!this.currentUser) return;
        
        this.currentUser.profile = { ...this.currentUser.profile, ...profileData };
        this.saveCurrentUser();
    }

    // Update user progress
    updateProgress(progressData) {
        if (!this.currentUser) return;
        
        this.currentUser.progress = { ...this.currentUser.progress, ...progressData };
        this.currentUser.progress.lastActivity = new Date().toISOString();
        this.saveCurrentUser();
    }

    // Complete a module
    completeModule(moduleId, score = null) {
        if (!this.currentUser) return;
        
        const progress = this.currentUser.progress;
        
        if (!progress.completedModules.includes(moduleId)) {
            progress.completedModules.push(moduleId);
        }
        
        if (score !== null) {
            progress.quizScores[moduleId] = score;
        }
        
        // Calculate overall progress
        progress.overallProgress = Math.round((progress.completedModules.length / 10) * 100); // Assuming 10 total modules
        
        this.updateProgress(progress);
    }

    // Reset progress to 0%
    resetProgress() {
        if (!this.currentUser) return;
        
        this.currentUser.progress = {
            overallProgress: 0,
            completedModules: [],
            currentModule: null,
            quizScores: {},
            timeSpent: 0,
            streak: 0,
            lastActivity: new Date().toISOString()
        };
        
        this.saveCurrentUser();
    }

    // Save current user data
    saveCurrentUser() {
        if (!this.currentUser) return;
        
        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
        }
        
        this.saveUsers();
        localStorage.setItem('loggedInUser', JSON.stringify(this.currentUser));
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get user statistics
    getUserStats() {
        if (!this.currentUser) return null;
        
        return {
            totalUsers: this.users.length,
            userProgress: this.currentUser.progress.overallProgress,
            completedModules: this.currentUser.progress.completedModules.length,
            streak: this.currentUser.progress.streak,
            timeSpent: this.currentUser.progress.timeSpent,
            joinDate: this.currentUser.createdAt
        };
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get all users (for admin purposes)
    getAllUsers() {
        return this.users;
    }

    // Export user data
    exportUserData() {
        if (!this.currentUser) return null;
        
        return {
            user: this.currentUser,
            stats: this.getUserStats()
        };
    }
}

// Initialize global user manager
window.userManager = new UserManager();

// Authentication helper functions
window.auth = {
    // Check if user is logged in
    requireAuth: function() {
        if (!window.userManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Redirect to dashboard if already logged in
    redirectIfLoggedIn: function() {
        if (window.userManager.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return true;
        }
        return false;
    },

    // Login and redirect
    loginAndRedirect: function(email, password) {
        try {
            window.userManager.login(email, password);
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    },

    // Register and redirect
    registerAndRedirect: function(userData) {
        try {
            window.userManager.registerUser(userData);
            window.location.href = 'welcome.html';
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    }
};

// Progress tracking helper functions
window.progress = {
    // Update progress bar
    updateProgressBar: function(progressElementId, percentage) {
        const progressBar = document.getElementById(progressElementId);
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    },

    // Show progress stats
    showProgressStats: function(containerId) {
        const stats = window.userManager.getUserStats();
        if (!stats) return;

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="progress-stat">
                    <h3>${stats.userProgress}%</h3>
                    <p>Overall Progress</p>
                </div>
                <div class="progress-stat">
                    <h3>${stats.completedModules}</h3>
                    <p>Modules Completed</p>
                </div>
                <div class="progress-stat">
                    <h3>${stats.streak}</h3>
                    <p>Day Streak</p>
                </div>
                <div class="progress-stat">
                    <h3>${Math.round(stats.timeSpent / 60)}h</h3>
                    <p>Time Spent</p>
                </div>
            `;
        }
    },

    // Track time spent
    startTimeTracking: function() {
        if (!window.userManager.isAuthenticated()) return;
        
        window.startTime = Date.now();
    },

    // Stop time tracking and update progress
    stopTimeTracking: function() {
        if (!window.userManager.isAuthenticated() || !window.startTime) return;
        
        const timeSpent = Date.now() - window.startTime;
        const currentProgress = window.userManager.getCurrentUser().progress;
        
        window.userManager.updateProgress({
            ...currentProgress,
            timeSpent: currentProgress.timeSpent + timeSpent
        });
        
        window.startTime = null;
    }
};

// Initialize time tracking on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.userManager.isAuthenticated()) {
        window.progress.startTimeTracking();
    }
});

// Track time when user leaves page
window.addEventListener('beforeunload', function() {
    window.progress.stopTimeTracking();
});
