// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    initializeAuth();
    
    // Set up form handlers
    setupFormHandlers();
    
    // Set up password strength checker
    setupPasswordStrength();
    
    // Add loading animations
    addLoadingAnimations();
});

function initializeAuth() {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Set up social auth buttons
    setupSocialAuth();
}

function checkAuthStatus() {
    const token = localStorage.getItem('neurotrade-token');
    if (token) {
        // User is logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

function setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.remember.checked;
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any email/password
        if (email && password) {
            // Store auth token
            const token = generateToken();
            localStorage.setItem('neurotrade-token', token);
            
            if (remember) {
                localStorage.setItem('neurotrade-remember', 'true');
            }
            
            // Show success message
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showNotification('Please fill in all fields', 'error');
            submitBtn.classList.remove('loading');
        }
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'experience', 'goals', 'terms'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Store user data (in real app, this would go to backend)
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            experience: formData.get('experience'),
            goals: formData.get('goals'),
            marketing: formData.get('marketing') === 'on'
        };
        
        localStorage.setItem('neurotrade-user', JSON.stringify(userData));
        
        // Generate and store auth token
        const token = generateToken();
        localStorage.setItem('neurotrade-token', token);
        
        // Show success message
        showNotification('Account created successfully! Starting your free trial...', 'success');
        
        // Redirect to modules page
        setTimeout(() => {
            window.location.href = 'course.html';
        }, 1500);
    }, 2000);
}

function generateToken() {
    // Generate a simple token for demo purposes
    return 'nt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthDisplay(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^a-zA-Z0-9]/)) score += 1;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'fair';
    if (score <= 4) return 'good';
    return 'strong';
}

function updatePasswordStrengthDisplay(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    // Remove all strength classes
    strengthFill.classList.remove('weak', 'fair', 'good', 'strong');
    
    // Add current strength class
    strengthFill.classList.add(strength);
    
    // Update text
    const strengthLabels = {
        weak: 'Weak password',
        fair: 'Fair password',
        good: 'Good password',
        strong: 'Strong password'
    };
    
    strengthText.textContent = strengthLabels[strength];
}

function setupSocialAuth() {
    // Google auth
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            showNotification('Google authentication coming soon!', 'info');
        });
    }
    
    // Discord auth
    const discordBtn = document.querySelector('.btn-discord');
    if (discordBtn) {
        discordBtn.addEventListener('click', function() {
            showNotification('Discord authentication coming soon!', 'info');
        });
    }
}

function togglePassword() {
    const passwordInput = document.querySelector('input[type="password"]');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.5s ease;
        font-weight: 500;
        max-width: 350px;
        ${getNotificationStyles(type)}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationStyles(type) {
    const styles = {
        success: `
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        `,
        error: `
            background: #ef4444;
            color: white;
        `,
        warning: `
            background: #f59e0b;
            color: white;
        `,
        info: `
            background: #3b82f6;
            color: white;
        `
    };
    return styles[type] || styles.info;
}

function addLoadingAnimations() {
    const elements = document.querySelectorAll('.auth-card, .auth-visual');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add form validation feedback
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
});

// Handle forgot password
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Password reset functionality coming soon!', 'info');
        });
    }
});

// Add some accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add focus indicators
    const focusableElements = document.querySelectorAll('input, select, button, a');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #10b981';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (form) {
                const submitBtn = form.querySelector('.btn-submit');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }
    });
});
