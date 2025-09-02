// HLC Academy Onboarding Funnel Analytics
// Simple event tracking for the multi-step signup flow

class OnboardingAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.userData = {};
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    trackEvent(eventName, data = {}) {
        const event = {
            sessionId: this.sessionId,
            eventName: eventName,
            timestamp: Date.now(),
            timeOnPage: Date.now() - this.startTime,
            data: data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.events.push(event);
        
        // Log to console for development
        console.log('Analytics Event:', event);
        
        // In production, send to your analytics service
        this.sendToAnalytics(event);
    }
    
    sendToAnalytics(event) {
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event.eventName, {
                'custom_parameter_1': JSON.stringify(event.data),
                'session_id': event.sessionId,
                'time_on_page': event.timeOnPage
            });
        }
        
        // Example: Send to Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track(event.eventName, {
                ...event.data,
                sessionId: event.sessionId,
                timeOnPage: event.timeOnPage
            });
        }
        
        // Example: Send to custom endpoint
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        }).catch(error => {
            console.log('Analytics endpoint not available:', error);
        });
    }
    
    // Specific tracking methods for the onboarding flow
    trackStepStarted(stepNumber, stepName) {
        this.trackEvent('step_started', {
            step: stepNumber,
            stepName: stepName
        });
    }
    
    trackStepCompleted(stepNumber, stepName, userData = {}) {
        this.trackEvent('step_completed', {
            step: stepNumber,
            stepName: stepName,
            userData: userData
        });
    }
    
    trackPlanSelected(planName, userData = {}) {
        this.trackEvent('plan_selected', {
            plan: planName,
            userData: userData
        });
    }
    
    trackCheckoutStarted(planName, userData = {}) {
        this.trackEvent('checkout_started', {
            plan: planName,
            userData: userData
        });
    }
    
    trackConversion(planName, userData = {}) {
        this.trackEvent('conversion', {
            plan: planName,
            userData: userData,
            totalTime: Date.now() - this.startTime
        });
    }
    
    trackDropoff(stepNumber, stepName, userData = {}) {
        this.trackEvent('dropoff', {
            step: stepNumber,
            stepName: stepName,
            userData: userData,
            timeOnPage: Date.now() - this.startTime
        });
    }
    
    // Track user profile data
    updateUserProfile(data) {
        this.userData = { ...this.userData, ...data };
    }
    
    // Get funnel metrics
    getFunnelMetrics() {
        const stepEvents = this.events.filter(e => e.eventName.includes('step'));
        const conversions = this.events.filter(e => e.eventName === 'conversion');
        const dropoffs = this.events.filter(e => e.eventName === 'dropoff');
        
        return {
            totalEvents: this.events.length,
            stepsCompleted: stepEvents.length,
            conversions: conversions.length,
            dropoffs: dropoffs.length,
            conversionRate: conversions.length / Math.max(stepEvents.length, 1),
            sessionDuration: Date.now() - this.startTime
        };
    }
}

// Initialize analytics
window.onboardingAnalytics = new OnboardingAnalytics();

// Track page load
window.onboardingAnalytics.trackEvent('page_loaded', {
    page: 'onboarding',
    referrer: document.referrer
});

// Track when user leaves the page
window.addEventListener('beforeunload', function() {
    const metrics = window.onboardingAnalytics.getFunnelMetrics();
    window.onboardingAnalytics.trackEvent('session_ended', metrics);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnboardingAnalytics;
}
