// Course page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize course page
    initializeCoursePage();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Animate progress elements
    animateProgressElements();
});

function initializeCoursePage() {
    // Add loading animations
    addLoadingAnimations();
    
    // Initialize progress circle
    initializeProgressCircle();
    
    // Set up module interactions
    setupModuleInteractions();
}

function addLoadingAnimations() {
    const elements = document.querySelectorAll('.module-card, .course-header, .features-section');
    
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

function initializeProgressCircle() {
    const progressRing = document.querySelector('.progress-ring');
    if (progressRing) {
        // Calculate progress (23%)
        const progress = 23;
        const circumference = 2 * Math.PI * 54; // 2πr
        const offset = circumference - (progress / 100) * circumference;
        
        // Set initial state
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;
        
        // Animate to target progress
        setTimeout(() => {
            progressRing.style.strokeDashoffset = offset;
        }, 500);
    }
}

function animateProgressElements() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width || '0%';
        
        // Reset to 0
        bar.style.width = '0%';
        
        // Animate to target width
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 800);
    });
}

function setupModuleInteractions() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('locked')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        });
        
        // Add click functionality for unlocked modules
        if (!this.classList.contains('locked')) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons or button children
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    console.log('Button click detected, not navigating module card');
                    return;
                }
                
                const moduleTitle = this.querySelector('h3').textContent;
                console.log(`Navigating to module: ${moduleTitle}`);
                // window.location.href = `module.html?name=${encodeURIComponent(moduleTitle)}`;
            });
        }
    });
}

function addInteractiveFeatures() {
    // Add button interactions
    setupButtonInteractions();
    
    // Add progress tracking
    setupProgressTracking();
    
    // Add achievement notifications
    setupAchievements();
}

function setupButtonInteractions() {
    // Summary button interactions
    const summaryButtons = document.querySelectorAll('.btn-summary');
    summaryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const moduleCard = this.closest('.module-card');
            const moduleTitle = moduleCard.querySelector('h3').textContent;
            
            showModuleSummary(moduleTitle);
        });
    });
    
    // Review button interactions
    const reviewButtons = document.querySelectorAll('.btn-review');
    reviewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const moduleCard = this.closest('.module-card');
            const moduleTitle = moduleCard.querySelector('h3').textContent;
            
            navigateToModuleReview(moduleTitle);
        });
    });
    
    // Continue button interactions
    const continueButtons = document.querySelectorAll('.btn-continue');
    console.log('Found continue buttons:', continueButtons.length);
    
    continueButtons.forEach((button, index) => {
        console.log(`Setting up continue button ${index}:`, button);
        
        button.addEventListener('click', function(e) {
            console.log('Continue button clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            const moduleCard = this.closest('.module-card');
            const moduleTitle = moduleCard.querySelector('h3').textContent;
            console.log('Module title:', moduleTitle);
            
            // Navigate to modules overview page
            console.log('Redirecting to modules overview');
            window.location.href = 'modules-overview.html';
        });
    });
}

function showModuleSummary(moduleTitle) {
    // Create summary modal
    const modal = document.createElement('div');
    modal.className = 'summary-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${moduleTitle} - Summary</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="summary-stats">
                        <div class="stat-item">
                            <span class="stat-label">Lessons Completed</span>
                            <span class="stat-value">4/4</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Quizzes Passed</span>
                            <span class="stat-value">8/8</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">XP Earned</span>
                            <span class="stat-value">150</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Time Spent</span>
                            <span class="stat-value">45 min</span>
                        </div>
                    </div>
                    <div class="summary-achievements">
                        <h4>🏆 Achievements Unlocked</h4>
                        <ul>
                            <li>First Steps - Complete your first lesson</li>
                            <li>Quiz Master - Pass all quizzes in a module</li>
                            <li>Speed Learner - Complete module in under 1 hour</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-review-module">Review Module</button>
                    <button class="btn-close-modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    
    // Add modal functionality
    const closeButtons = modal.querySelectorAll('.modal-close, .btn-close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Close on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.body.removeChild(modal);
        }
    });
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .summary-modal .modal-overlay {
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .summary-modal .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .summary-modal .modal-header {
            padding: 25px 25px 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .summary-modal .modal-header h3 {
            margin: 0;
            color: #1f2937;
        }
        
        .summary-modal .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .summary-modal .modal-close:hover {
            background: #f3f4f6;
        }
        
        .summary-modal .modal-body {
            padding: 25px;
        }
        
        .summary-modal .summary-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .summary-modal .stat-item {
            text-align: center;
            padding: 15px;
            background: #f9fafb;
            border-radius: 8px;
        }
        
        .summary-modal .stat-label {
            display: block;
            color: #6b7280;
            font-size: 0.85rem;
            margin-bottom: 5px;
        }
        
        .summary-modal .stat-value {
            display: block;
            color: #10b981;
            font-weight: 700;
            font-size: 1.2rem;
        }
        
        .summary-modal .summary-achievements h4 {
            color: #1f2937;
            margin-bottom: 15px;
        }
        
        .summary-modal .summary-achievements ul {
            list-style: none;
            padding: 0;
        }
        
        .summary-modal .summary-achievements li {
            padding: 8px 0;
            color: #6b7280;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .summary-modal .modal-footer {
            padding: 20px 25px 25px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .summary-modal .btn-review-module,
        .summary-modal .btn-close-modal {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .summary-modal .btn-review-module {
            background: #10b981;
            color: white;
        }
        
        .summary-modal .btn-review-module:hover {
            background: #059669;
        }
        
        .summary-modal .btn-close-modal {
            background: #f3f4f6;
            color: #6b7280;
        }
        
        .summary-modal .btn-close-modal:hover {
            background: #e5e7eb;
        }
    `;
    
    document.head.appendChild(style);
    
    // Animate modal in
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
}

function navigateToModuleReview(moduleTitle) {
    console.log(`Navigating to review for: ${moduleTitle}`);
    // window.location.href = `review.html?module=${encodeURIComponent(moduleTitle)}`;
}

function continueModule(moduleTitle) {
    console.log(`Continuing module: ${moduleTitle}`);
    
    // Redirect to appropriate lesson page based on module
    if (moduleTitle === 'Market Structure') {
        window.location.href = 'lesson-video.html';
    } else {
        // For other modules, redirect to a generic lesson page
        window.location.href = `lesson-video.html?module=${encodeURIComponent(moduleTitle)}`;
    }
}

function setupProgressTracking() {
    // Track module progress
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.style.width;
                    entry.target.style.width = '0%';
                    
                    setTimeout(() => {
                        entry.target.style.width = targetWidth;
                    }, 200);
                }
            });
        });
        
        observer.observe(bar);
    });
}

function setupAchievements() {
    // Check for achievements when modules are completed
    const completedModules = document.querySelectorAll('.module-card.completed');
    
    if (completedModules.length >= 1) {
        setTimeout(() => {
            showAchievement('First Module Complete! 🎉');
        }, 1000);
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

// Add some additional interactive features
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
});
