// Main JavaScript for NeuroTrade Homepage

document.addEventListener('DOMContentLoaded', function() {
    ensureScrollingEnabled();
    initializeHomepage();
});

function initializeHomepage() {
    addLoadingAnimations();
    setupExitIntentModal();
    setupStickyCTA();
    // setupSocialProofToasts(); // Disabled floating messages
    setupSmoothScrolling();
    setupNavbarScroll();
    setupElementAnimations();
}

// Loading Animations
function addLoadingAnimations() {
    const elements = document.querySelectorAll('.hero, .value-prop, .social-proof, .neuroscience-edge, .how-it-works, .features, .outcomes, .proof-section, .pricing, .final-cta, .faq');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Exit Intent Modal
function setupExitIntentModal() {
    let hasShownModal = false;
    let mouseLeaveCount = 0;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !hasShownModal && mouseLeaveCount === 0) {
            mouseLeaveCount++;
            setTimeout(() => {
                if (mouseLeaveCount === 1) {
                    showExitModal();
                    hasShownModal = true;
                }
            }, 1000);
        }
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('exit-modal')) {
            hideExitModal();
        }
    });
}

function showExitModal() {
    const modal = document.getElementById('exitModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideExitModal() {
    const modal = document.getElementById('exitModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.overflow = 'auto';
    }
}

// Ensure scrolling is always enabled on page load
function ensureScrollingEnabled() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
}

// Sticky CTA
function setupStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    if (!stickyCTA) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 500) {
            stickyCTA.style.transform = 'translateY(0)';
        } else {
            stickyCTA.style.transform = 'translateY(100%)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Initialize position
    stickyCTA.style.transform = 'translateY(100%)';
    stickyCTA.style.transition = 'transform 0.3s ease';
}

// Social Proof Toasts
function setupSocialProofToasts() {
    const messages = [
        "Marcus just joined the London cohort",
        "Priya completed Module 1",
        "James achieved his daily XP goal",
        "Sofia joined the Discord community",
        "Oliver attended the live call"
    ];
    
    let toastIndex = 0;
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            showSocialProofToast(messages[toastIndex % messages.length]);
            toastIndex++;
        }
    }, 8000); // Every 8 seconds
}

function showSocialProofToast(message) {
    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">🎉</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 15px 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Element Animations
function setupElementAnimations() {
    const animatedElements = document.querySelectorAll('.edge-card, .feature-card, .outcome-item, .proof-item, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form Handling
function setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    const styles = getNotificationStyles(type);
    Object.assign(notification.style, styles);
    
    notification.style.cssText += `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1002;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
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
        success: {
            background: '#f0fdf4',
            color: '#065f46',
            border: '1px solid #d1fae5'
        },
        error: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca'
        },
        warning: {
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fed7aa'
        },
        info: {
            background: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #bfdbfe'
        }
    };
    return styles[type] || styles.info;
}

// Progress Bar Animation
function animateProgressBar() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const fill = bar.querySelector('.progress-fill');
        if (fill) {
            const targetWidth = fill.getAttribute('data-width') || '75%';
            fill.style.width = '0%';
            
            setTimeout(() => {
                fill.style.transition = 'width 1.5s ease';
                fill.style.width = targetWidth;
            }, 500);
        }
    });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.proof-number, .stat-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const suffix = counter.textContent.replace(/[\d]/g, '');
        
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Hover Effects
function setupHoverEffects() {
    const cards = document.querySelectorAll('.edge-card, .feature-card, .outcome-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Parallax Effect
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero, .value-prop');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize all features when page loads
window.addEventListener('load', function() {
    animateProgressBar();
    animateCounters();
    setupHoverEffects();
    setupParallax();
    setupFormHandlers();
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle scroll events for performance
const throttledScroll = debounce(function() {
    // Scroll-based animations can go here
}, 16);

window.addEventListener('scroll', throttledScroll);

// Backup: Ensure scrolling is enabled on window load
window.addEventListener('load', function() {
    ensureScrollingEnabled();
});

// Additional backup: Reset scrolling on any potential issues
window.addEventListener('beforeunload', function() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
});
