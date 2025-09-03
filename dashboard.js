// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!window.auth.requireAuth()) {
        return;
    }
    
    // Initialize dashboard with user data
    initializeDashboard();
    
    // Set up real-time updates
    setupRealTimeUpdates();
    
    // Add interactive features
    addInteractiveFeatures();
});

function initializeDashboard() {
    // Load user data and personalize dashboard
    loadUserData();
    
    // Animate progress bars on load
    animateProgressBars();
    
    // Animate XP counter
    animateXPCounter();
    
    // Update time remaining
    updateTimeRemaining();
    
    // Add loading animations
    addLoadingAnimations();
}

function loadUserData() {
    const user = window.userManager.getCurrentUser();
    if (!user) return;
    
    // Update user name
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.firstName || 'User';
    }
    
    // Update progress
    const progress = user.progress;
    const progressPercentage = document.getElementById('progressPercentage');
    const progressFill = document.getElementById('progressFill');
    const modulesCompleted = document.getElementById('modulesCompleted');
    const totalXP = document.getElementById('totalXP');
    
    if (progressPercentage) {
        progressPercentage.textContent = `${progress.overallProgress}% Complete`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${progress.overallProgress}%`;
    }
    
    if (modulesCompleted) {
        modulesCompleted.textContent = `${progress.completedModules.length} of 13 modules completed`;
    }
    
    if (totalXP) {
        totalXP.textContent = `${progress.timeSpent} XP earned`;
    }
    
    // Update streak
    const streakText = document.getElementById('streakText');
    const streakNumber = document.getElementById('streakNumber');
    
    if (streakText) {
        streakText.textContent = `${progress.streak}-day streak`;
    }
    
    if (streakNumber) {
        streakNumber.textContent = progress.streak;
    }
    
    // Update motivation stats
    const daysActive = document.getElementById('daysActive');
    const totalXPStats = document.getElementById('totalXPStats');
    
    if (daysActive) {
        const joinDate = new Date(user.createdAt);
        const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        daysActive.textContent = Math.max(daysSinceJoin, 1);
    }
    
    if (totalXPStats) {
        totalXPStats.textContent = progress.timeSpent;
    }
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill, .xp-progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width || '0%';
        
        // Reset to 0
        bar.style.width = '0%';
        
        // Animate to target width
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

function animateXPCounter() {
    const xpCurrent = document.querySelector('.xp-current');
    const xpProgressFill = document.querySelector('.xp-progress-fill');
    
    if (xpCurrent && xpProgressFill) {
        const targetXP = 75; // This would come from user data
        let currentXP = 0;
        const increment = targetXP / 50;
        
        const counter = setInterval(() => {
            currentXP += increment;
            if (currentXP >= targetXP) {
                currentXP = targetXP;
                clearInterval(counter);
            }
            
            // Update XP display
            xpCurrent.textContent = Math.floor(currentXP);
            
            // Update progress bar
            const progressPercentage = (currentXP / 100) * 100;
            xpProgressFill.style.width = Math.min(progressPercentage, 100) + '%';
        }, 50);
    }
}

function updateTimeRemaining() {
    const timeRemaining = document.querySelector('.time-remaining');
    
    if (timeRemaining) {
        // Calculate time until midnight
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        
        const timeDiff = midnight - now;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        timeRemaining.textContent = `${hours}h ${minutes}m left`;
        
        // Update every minute
        setInterval(updateTimeRemaining, 60000);
    }
}

function addLoadingAnimations() {
    const elements = document.querySelectorAll('.widget, .progress-section, .motivation-section');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupRealTimeUpdates() {
    // Simulate real-time XP updates
    setInterval(() => {
        updateXPDisplay();
    }, 30000); // Update every 30 seconds
    
    // Update streak display
    updateStreakDisplay();
}

function updateXPDisplay() {
    const xpCurrent = document.querySelector('.xp-current');
    const xpProgressFill = document.querySelector('.xp-progress-fill');
    
    if (xpCurrent && xpProgressFill) {
        // Simulate small XP gain
        const currentXP = parseInt(xpCurrent.textContent);
        const newXP = Math.min(currentXP + Math.floor(Math.random() * 5), 100);
        
        // Animate the change
        animateXPChange(currentXP, newXP);
    }
}

function animateXPChange(oldValue, newValue) {
    const xpCurrent = document.querySelector('.xp-current');
    const xpProgressFill = document.querySelector('.xp-progress-fill');
    
    if (xpCurrent && xpProgressFill) {
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(oldValue + (newValue - oldValue) * easeOut);
            
            xpCurrent.textContent = currentValue;
            
            // Update progress bar
            const progressPercentage = (currentValue / 100) * 100;
            xpProgressFill.style.width = Math.min(progressPercentage, 100) + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

function updateStreakDisplay() {
    const streakText = document.querySelector('.streak-text');
    
    if (streakText) {
        // This would come from user data
        const currentStreak = 3;
        
        // Add some visual feedback for streak
        if (currentStreak >= 3) {
            streakText.style.color = '#92400e';
            streakText.style.fontWeight = '700';
        }
    }
}

function addInteractiveFeatures() {
    // Add hover effects to module cards
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('locked')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Add click functionality for unlocked modules
        if (!this.classList.contains('locked')) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                // Navigate to module page
                const moduleTitle = this.querySelector('h4').textContent;
                console.log(`Navigating to: ${moduleTitle}`);
                // window.location.href = `module.html?name=${encodeURIComponent(moduleTitle)}`;
            });
        }
    });
    
    // Add click functionality to action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add progress bar hover effect
    const progressSection = document.querySelector('.progress-section');
    if (progressSection) {
        progressSection.addEventListener('mouseenter', function() {
            const progressFill = this.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.transform = 'scaleY(1.2)';
            }
        });
        
        progressSection.addEventListener('mouseleave', function() {
            const progressFill = this.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.transform = 'scaleY(1)';
            }
        });
    }
}

// Add some gamification elements
function addGamification() {
    // Celebrate XP milestones
    const xpCurrent = document.querySelector('.xp-current');
    if (xpCurrent) {
        const currentXP = parseInt(xpCurrent.textContent);
        
        if (currentXP >= 50 && currentXP < 55) {
            showAchievement('Halfway there! 🎯');
        } else if (currentXP >= 100) {
            showAchievement('Daily goal achieved! 🎉');
        }
    }
}

function showAchievement(message) {
    // Create achievement notification
    const achievement = document.createElement('div');
    achievement.className = 'achievement-notification';
    achievement.innerHTML = `
        <div class="achievement-content">
            <span class="achievement-icon">🏆</span>
            <span class="achievement-text">${message}</span>
        </div>
    `;
    
    // Add styles
    achievement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.5s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(achievement);
    
    // Animate in
    setTimeout(() => {
        achievement.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        achievement.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(achievement);
        }, 500);
    }, 3000);
}

// Initialize gamification
setTimeout(addGamification, 2000);

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.userManager.logout();
        window.location.href = 'index.html';
    }
}
