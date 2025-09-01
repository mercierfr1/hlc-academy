// Goals page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize goals page
    initializeGoalsPage();
    
    // Set up goal interactions
    setupGoalInteractions();
    
    // Initialize progress chart
    initializeProgressChart();
    
    // Add loading animations
    addLoadingAnimations();
});

function initializeGoalsPage() {
    // Reset progress to fresh account
    resetProgress();
    
    // Load saved goal from localStorage
    loadSavedGoal();
    
    // Set up chart period controls
    setupChartPeriodControls();
    
    // Set up goal change listener for projections
    setupGoalChangeListener();
    
    // Start real-time date updates
    startRealTimeUpdates();
}

function resetProgress() {
    // Clear any stored progress data
    localStorage.removeItem('fxmaster-progress');
    localStorage.removeItem('fxmaster-videos-completed');
    localStorage.removeItem('fxmaster-subsections-completed');
    
    // Reset daily goal to default if not set
    if (!localStorage.getItem('fxmaster-daily-goal')) {
        localStorage.setItem('fxmaster-daily-goal', '100');
    }
}

function resetProgressAndRefresh() {
    // Clear all progress data
    resetProgress();
    
    // Show confirmation message
    const resetBtn = document.querySelector('.reset-progress-btn');
    const originalText = resetBtn.innerHTML;
    resetBtn.innerHTML = '<span class="reset-icon">✅</span> Progress Reset!';
    resetBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    // Reset button appearance after 2 seconds
    setTimeout(() => {
        resetBtn.innerHTML = originalText;
        resetBtn.style.background = 'linear-gradient(135deg, #6128DB, #4a1fa8)';
    }, 2000);
    
    // Refresh the chart with fresh data
    const activePeriod = document.querySelector('.chart-period.active');
    if (activePeriod) {
        const period = activePeriod.getAttribute('data-period');
        updateChartData(period);
    }
}

function loadSavedGoal() {
    const savedGoal = localStorage.getItem('fxmaster-daily-goal') || 100;
    const goalPreset = document.querySelector(`[data-xp="${savedGoal}"]`);
    
    if (goalPreset) {
        // Remove active class from all presets
        document.querySelectorAll('.goal-preset').forEach(preset => {
            preset.classList.remove('active');
        });
        
        // Add active class to saved goal
        goalPreset.classList.add('active');
    }
    
    // Update the daily goal display
    updateDailyGoalDisplay();
}

function updateDailyGoalDisplay() {
    const dailyGoalDisplay = document.getElementById('daily-goal-display');
    if (dailyGoalDisplay) {
        const currentGoal = parseInt(localStorage.getItem('fxmaster-daily-goal')) || 100;
        dailyGoalDisplay.textContent = `${currentGoal} XP`;
    }
}

function setupGoalInteractions() {
    console.log('Setting up goal interactions...');
    
    // Goal preset selection
    const goalPresets = document.querySelectorAll('.goal-preset');
    console.log('Found goal presets:', goalPresets.length);
    
    goalPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            console.log('Goal preset clicked:', this.getAttribute('data-xp'));
            const xpValue = this.getAttribute('data-xp');
            
            // Remove active class from all presets
            goalPresets.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked preset
            this.classList.add('active');
            
            // Save goal to localStorage
            localStorage.setItem('fxmaster-daily-goal', xpValue);
            console.log('Saved goal to localStorage:', xpValue);
            
            // Update dashboard if it exists
            updateDashboardGoal(xpValue);
            
            // Update chart projections
            updateChartProjections();
            
            // Update daily goal display
            updateDailyGoalDisplay();
            
            // Show confirmation
            showGoalConfirmation(xpValue);
        });
    });
    
    // Custom goal input
    const customInput = document.getElementById('custom-xp');
    const setCustomBtn = document.querySelector('.btn-set-custom');
    
    if (setCustomBtn && customInput) {
        setCustomBtn.addEventListener('click', function() {
            const customXP = parseInt(customInput.value);
            
            if (customXP && customXP > 0 && customXP <= 1000) {
                // Remove active class from all presets
                goalPresets.forEach(p => p.classList.remove('active'));
                
                // Save custom goal
                localStorage.setItem('fxmaster-daily-goal', customXP);
                
                // Update dashboard
                updateDashboardGoal(customXP);
                
                // Update daily goal display
                updateDailyGoalDisplay();
                
                // Show confirmation
                showGoalConfirmation(customXP);
                
                // Clear input
                customInput.value = '';
            } else {
                showError('Please enter a valid XP amount between 1 and 1000');
            }
        });
        
        // Allow Enter key to set custom goal
        customInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setCustomBtn.click();
            }
        });
    }
}

function updateDashboardGoal(xpValue) {
    // This would update the dashboard if it's open in another tab
    // For now, we'll just log it
    console.log(`Daily goal updated to: ${xpValue} XP`);
    
    // You could also use localStorage events to sync across tabs
    localStorage.setItem('fxmaster-goal-updated', Date.now().toString());
}

function showGoalConfirmation(xpValue) {
    // Create confirmation notification
    const confirmation = document.createElement('div');
    confirmation.className = 'goal-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <span class="confirmation-icon">🎯</span>
            <span class="confirmation-text">Daily goal set to ${xpValue} XP!</span>
        </div>
    `;
    
    // Add styles
    confirmation.style.cssText = `
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
    
    document.body.appendChild(confirmation);
    
    // Animate in
    setTimeout(() => {
        confirmation.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        confirmation.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(confirmation);
        }, 500);
    }, 3000);
}

function showError(message) {
    // Create error notification
    const error = document.createElement('div');
    error.className = 'goal-error';
    error.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
        </div>
    `;
    
    // Add styles
    error.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.5s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(error);
    
    // Animate in
    setTimeout(() => {
        error.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        error.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(error);
        }, 500);
    }, 3000);
}

function setupChartPeriodControls() {
    console.log('Setting up chart period controls...');
    const periodButtons = document.querySelectorAll('.chart-period');
    console.log('Found period buttons:', periodButtons.length);
    
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            console.log('Period button clicked:', period);
            
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            console.log('Chart period changed to:', period);
            
            // Update chart data
            updateChartData(period);
        });
    });
    
    // Ensure chart is initialized with the active period
    const activeButton = document.querySelector('.chart-period.active');
    if (activeButton) {
        const period = activeButton.getAttribute('data-period');
        console.log('Initializing chart with period:', period);
        updateChartData(period);
    } else {
        console.log('No active period button found');
    }
}

// Add event listener for goal changes to update projections
function setupGoalChangeListener() {
    const goalPresets = document.querySelectorAll('.goal-preset');
    goalPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            // Update chart after a short delay to ensure localStorage is updated
            setTimeout(() => {
                const activePeriod = document.querySelector('.chart-period.active');
                if (activePeriod) {
                    const period = activePeriod.getAttribute('data-period');
                    updateChartData(period);
                }
            }, 100);
        });
    });
}

function updateChartProjections() {
    console.log('Updating chart projections...');
    
    // Update chart after a short delay to ensure localStorage is updated
    setTimeout(() => {
        const activePeriod = document.querySelector('.chart-period.active');
        console.log('Active period:', activePeriod);
        
        if (activePeriod) {
            const period = activePeriod.getAttribute('data-period');
            console.log('Period value:', period);
            updateChartData(period);
        } else {
            console.log('No active period found');
        }
    }, 100);
}

function updateChartData(period) {
    // This would fetch and update chart data based on the selected period
    console.log(`Updating chart for ${period} days`);
    
    // For now, we'll just regenerate the chart with sample data
    generateSampleChart(period);
}

function initializeProgressChart() {
    // Generate initial chart with 7-day data
    generateSampleChart(7);
}

function generateSampleChart(days) {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Generate sample data
    const data = generateSampleData(days);
    
    // Draw chart
    drawChart(ctx, data, width, height);
}

// Global course constants
const TOTAL_VIDEOS = 100;
const XP_PER_VIDEO = 15;
const XP_PER_QUIZ_ANSWER = 2;
const QUIZZES_PER_VIDEO = 1; // 1 quiz per video
const SUBSECTION_QUIZ_XP = 25; // Bonus XP for completing subsection quizzes
const SUBSECTIONS_PER_MODULE = 3; // Average subsections per module
const TOTAL_SUBSECTIONS = 21; // Total subsections across all modules
const MAX_QUIZ_XP_PER_VIDEO = XP_PER_QUIZ_ANSWER * QUIZZES_PER_VIDEO; // 2 XP per video
const SUBSECTION_QUIZ_BONUS = TOTAL_SUBSECTIONS * SUBSECTION_QUIZ_XP; // 525 XP for subsection quizzes
const TOTAL_COURSE_XP = TOTAL_VIDEOS * (XP_PER_VIDEO + MAX_QUIZ_XP_PER_VIDEO) + SUBSECTION_QUIZ_BONUS; // 5000 XP

function generateSampleData(days) {
    const data = [];
    const today = new Date();
    const currentGoal = parseInt(localStorage.getItem('fxmaster-daily-goal')) || 100;
    
    // Generate historical data - starting from 0 XP for fresh account
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Start with 0 XP for all historical data (fresh account)
        const xp = 0;
        
        data.push({
            date: date,
            xp: xp,
            goal: currentGoal,
            type: 'historical',
            videosCompleted: 0, // 0 videos completed
            totalCourseXP: TOTAL_COURSE_XP
        });
    }
    
    // Generate projection data for future dates - always generate some projection data
    const projectionDays = Math.min(days * 2, 365); // Generate projection data for 2x the selected period, capped at 1 year
    let cumulativeXP = 0; // Start from 0 XP for fresh account
    
    for (let i = 1; i <= projectionDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        // Calculate projected XP based on daily goal
        cumulativeXP += currentGoal;
        
        data.push({
            date: date,
            xp: cumulativeXP,
            goal: currentGoal,
            type: 'projection',
            videosCompleted: Math.floor(cumulativeXP / (XP_PER_VIDEO + MAX_QUIZ_XP_PER_VIDEO)),
            totalCourseXP: TOTAL_COURSE_XP
        });
    }
    
    console.log('Generated data:', data);
    console.log('Historical data count:', data.filter(d => d.type === 'historical').length);
    console.log('Projection data count:', data.filter(d => d.type === 'projection').length);
    
    return data;
}

function drawChart(ctx, data, width, height) {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Debug: Log data for troubleshooting
    console.log('Chart data:', data);
    console.log('Data length:', data.length);
    console.log('Historical data:', data.filter(d => d.type === 'historical'));
    console.log('Projection data:', data.filter(d => d.type === 'projection'));
    
    // Find max XP value for scaling - ensure minimum scale for visibility
    const maxXP = Math.max(...data.map(d => d.xp), ...data.map(d => d.goal), 100); // Minimum 100 XP for scale
    const scale = chartHeight / (maxXP * 1.2);
    
    console.log('Max XP:', maxXP, 'Scale:', scale);
    
    // Clear the canvas first
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Update Y-axis labels with income projections
    updateIncomeLabels(maxXP);
    
    // Draw grid lines
    drawGrid(ctx, width, height, padding, maxXP, scale, data);
    
    // Draw baseline at 0 XP for visibility
    drawBaseline(ctx, width, height, padding);
    
    // Draw projection line with XP values
    drawProjectionLine(ctx, data, width, height, padding, scale);
    
    // Draw labels
    drawLabels(ctx, data, width, height, padding);
}

function drawGrid(ctx, width, height, padding, maxXP, scale, data) {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + (i * height - 2 * padding) / gridLines;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Draw Y-axis labels (XP values)
        const xpValue = Math.round(maxXP * (1 - i / gridLines));
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`${xpValue} XP`, padding - 10, y + 4);
    }
    
    // Vertical grid lines - only for historical data points
    const historicalData = data.filter(d => d.type === 'historical');
    for (let i = 0; i < historicalData.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (historicalData.length - 1);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
}

function drawGoalLine(ctx, data, width, height, padding, scale) {
    console.log('Drawing goal line with scale:', scale);
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3; // Increased line width for visibility
    ctx.setLineDash([8, 4]); // More visible dash pattern
    
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        // Ensure the goal line is visible by positioning it above the baseline
        const y = height - padding - (data[i].goal * scale);
        
        console.log(`Goal line point ${i}: x=${x}, y=${y}, goal=${data[i].goal}`);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Reset line dash
    ctx.setLineDash([]);
}

function drawProjectionLine(ctx, data, width, height, padding, scale) {
    const historicalData = data.filter(d => d.type === 'historical');
    const projectionData = data.filter(d => d.type === 'projection');
    
    console.log('Drawing projection line:', { historicalData: historicalData.length, projectionData: projectionData.length });
    
    if (projectionData.length === 0) {
        console.log('No projection data, skipping projection line');
        return;
    }
    
    ctx.strokeStyle = '#6128DB';
    ctx.lineWidth = 5; // Increased line width for better visibility
    ctx.setLineDash([12, 8]); // More visible dash pattern
    
    ctx.beginPath();
    
    // Start from the last historical data point (0 XP for fresh account)
    const lastHistorical = historicalData[historicalData.length - 1];
    const startX = padding + ((historicalData.length - 1) * (width - 2 * padding)) / (data.length - 1);
    // Start from the baseline (0 XP) but ensure it's visible
    const startY = height - padding;
    console.log(`Projection start: x=${startX}, y=${startY}, xp=${lastHistorical.xp}`);
    ctx.moveTo(startX, startY);
    
    // Draw projection line
    for (let i = 0; i < projectionData.length; i++) {
        const x = padding + ((historicalData.length + i) * (width - 2 * padding)) / (data.length - 1);
        const y = height - padding - (projectionData[i].xp * scale);
        console.log(`Projection point ${i}: x=${x}, y=${y}, xp=${projectionData[i].xp}`);
        ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add XP value labels along the projection line
    drawProjectionLabels(ctx, projectionData, historicalData, width, height, padding, scale);
}

function drawBaseline(ctx, width, height, padding) {
    // Draw a baseline at 0 XP to show starting point
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.setLineDash([]);
}

function drawProjectionLabels(ctx, projectionData, historicalData, width, height, padding, scale) {
    // Draw XP value labels at key points along the projection line
    ctx.fillStyle = '#6128DB';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'left';
    
    // Show XP values at key intervals
    const keyIntervals = [7, 30, 90, 180, 365]; // Show labels at 1 week, 1, 3, 6, 12 months
    keyIntervals.forEach(interval => {
        if (interval <= projectionData.length) {
            const dataIndex = interval - 1;
            const x = padding + ((historicalData.length + dataIndex) * (width - 2 * padding)) / (historicalData.length + projectionData.length - 1);
            const y = height - padding - (projectionData[dataIndex].xp * scale);
            
            // Only show label if it's within the chart bounds
            if (y > padding + 20) {
                const xpValue = projectionData[dataIndex].xp;
                const labelText = `${xpValue} XP`;
                
                // Draw background for better readability
                const textMetrics = ctx.measureText(labelText);
                const labelWidth = textMetrics.width + 8;
                const labelHeight = 16;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(x + 5, y - labelHeight/2 - 2, labelWidth, labelHeight);
                
                // Draw text
                ctx.fillStyle = '#6128DB';
                ctx.fillText(labelText, x + 9, y + 4);
                
                // Draw connecting line to projection line
                ctx.strokeStyle = '#6128DB';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(x + 5, y);
                ctx.lineTo(x + 5, y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    });
}

function updateIncomeLabels(maxXP) {
    const currentGoal = parseInt(localStorage.getItem('fxmaster-daily-goal')) || 100;
    const daysToProject = 365;
    
    // Target: $10,000 per month income
    const targetMonthlyIncome = 10000;
    const targetDailyIncome = targetMonthlyIncome / 30; // $333.33 per day
    
    // Calculate XP required to reach $10,000/month
    // Assuming linear relationship: XP directly correlates to income potential
    const xpToIncomeRatio = 0.1; // $0.10 per XP earned
    const xpRequiredForTarget = targetMonthlyIncome / xpToIncomeRatio; // 100,000 XP
    
    // Calculate time to reach target income based on current daily XP goal
    const dailyXPWithQuizzes = currentGoal + (currentGoal / (XP_PER_VIDEO + MAX_QUIZ_XP_PER_VIDEO)) * MAX_QUIZ_XP_PER_VIDEO + (SUBSECTION_QUIZ_XP / 30);
    const daysToTargetIncome = Math.ceil(xpRequiredForTarget / dailyXPWithQuizzes);
    
    // Calculate projected income based on current pace
    const projectedXP = Math.min(currentGoal * daysToProject, xpRequiredForTarget);
    const projectedIncome = projectedXP * xpToIncomeRatio;
    
    // Update the projected income display
    const projectedIncomeElement = document.getElementById('projected-income');
    if (projectedIncomeElement) {
        projectedIncomeElement.textContent = `$${Math.round(projectedIncome).toLocaleString()}`;
    }
    
    // Update Y-axis labels to show income progression to $10K/month (only 10k and above)
    const labelValues = document.querySelectorAll('.y-axis-labels .label-value');
    if (labelValues.length >= 5) {
        const incomeLevels = [
            Math.round(targetMonthlyIncome * 0.5),   // $5K (50% of target)
            Math.round(targetMonthlyIncome * 0.6),   // $6K (60% of target)
            Math.round(targetMonthlyIncome * 0.7),   // $7K (70% of target)
            Math.round(targetMonthlyIncome * 0.8),   // $8K (80% of target)
            Math.round(targetMonthlyIncome)           // $10K (100% of target)
        ];
        
        labelValues.forEach((label, index) => {
            if (index < incomeLevels.length) {
                label.textContent = `$${incomeLevels[index].toLocaleString()}`;
            }
        });
    }
    
    // Update course progress stats with new target
    updateCourseProgressStats(projectedXP, xpRequiredForTarget, daysToTargetIncome);
}

function updateCourseProgressStats(projectedXP, xpRequiredForTarget, daysToTargetIncome) {
    const completionPercentage = Math.round((projectedXP / xpRequiredForTarget) * 100);
    const videosCompleted = Math.floor(projectedXP / 17); // 17 XP per video (15 + 2 quiz)
    
    // Update the time-to-target display
    const timeToTargetDisplay = document.getElementById('time-to-target-display');
    if (timeToTargetDisplay) {
        timeToTargetDisplay.textContent = `${daysToTargetIncome} days`;
    }
    
    // Update stats display
    const statsContainer = document.querySelector('.chart-stats');
    if (statsContainer) {
        // Update or create income progress stats
        let incomeProgressStat = statsContainer.querySelector('.income-progress-stat');
        if (!incomeProgressStat) {
            incomeProgressStat = document.createElement('div');
            incomeProgressStat.className = 'stat-item income-progress-stat';
            statsContainer.appendChild(incomeProgressStat);
        }
        
        incomeProgressStat.innerHTML = `
            <span class="stat-label">Income Progress</span>
            <span class="stat-value">${completionPercentage}%</span>
            <span class="stat-subtitle">to $10K/month</span>
        `;
        
        // Update XP progress stat
        let xpProgressStat = statsContainer.querySelector('.xp-progress-stat');
        if (!xpProgressStat) {
            xpProgressStat = document.createElement('div');
            xpProgressStat.className = 'stat-item xp-progress-stat';
            statsContainer.appendChild(xpProgressStat);
        }
        
        xpProgressStat.innerHTML = `
            <span class="stat-label">XP Progress</span>
            <span class="stat-value">${Math.round(projectedXP).toLocaleString()}</span>
            <span class="stat-subtitle">/ ${Math.round(xpRequiredForTarget).toLocaleString()} XP</span>
        `;
        
        // Update time to target income stat
        let timeToTargetStat = statsContainer.querySelector('.time-to-target-stat');
        if (!timeToTargetStat) {
            timeToTargetStat = document.createElement('div');
            timeToTargetStat.className = 'stat-item time-to-target-stat';
            statsContainer.appendChild(timeToTargetStat);
        }
        
        timeToTargetStat.innerHTML = `
            <span class="stat-label">Time to $10K/month</span>
            <span class="stat-value">${daysToTargetIncome} days</span>
            <span class="stat-subtitle">at current pace</span>
        `;
    }
}

function drawXPBars(ctx, data, width, height, padding, scale) {
    const barWidth = (width - 2 * padding) / data.length * 0.6;
    
    data.forEach((item, i) => {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1) - barWidth / 2;
        const barHeight = item.xp * scale;
        const y = height - padding - barHeight;
        
        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add bar border
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    });
}

function drawLabels(ctx, data, width, height, padding) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    // Only show labels for historical data and key projection points
    const historicalData = data.filter(d => d.type === 'historical');
    const projectionData = data.filter(d => d.type === 'projection');
    
    // Draw historical labels
    historicalData.forEach((item, i) => {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        const y = height - padding + 20;
        
        // Format date
        const dateStr = item.date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        ctx.fillText(dateStr, x, y);
    });
    
    // Draw projection labels at key intervals with real-time dates
    if (projectionData.length > 0) {
        const keyIntervals = [7, 30, 90, 180, 365]; // Show labels at 1 week, 1, 3, 6, 12 months
        keyIntervals.forEach(interval => {
            if (interval <= projectionData.length) {
                const x = padding + ((historicalData.length + interval - 1) * (width - 2 * padding)) / (data.length - 1);
                const y = height - padding + 20;
                
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + interval);
                
                let dateStr;
                if (interval <= 30) {
                    dateStr = futureDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    });
                } else {
                    dateStr = futureDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                    });
                }
                
                ctx.fillText(dateStr, x, y);
            }
        });
    }
}

// Real-time date update function
function startRealTimeUpdates() {
    // Update current time display every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Update chart every minute to keep dates current
    setInterval(() => {
        const activePeriod = document.querySelector('.chart-period.active');
        if (activePeriod) {
            const period = activePeriod.getAttribute('data-period');
            updateChartData(period);
        }
    }, 60000); // Update every minute
}

function updateCurrentTime() {
    const timeElement = document.getElementById('time-value');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
}

function addLoadingAnimations() {
    const elements = document.querySelectorAll('.goal-card, .chart-card, .motivation-section');
    
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

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to goal presets
    const goalPresets = document.querySelectorAll('.goal-preset');
    goalPresets.forEach(preset => {
        preset.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
            }
        });
        
        preset.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            }
        });
    });
    
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

// Listen for goal updates from other tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'fxmaster-goal-updated') {
        // Reload saved goal
        loadSavedGoal();
    }
});
