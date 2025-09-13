// Mood Tracker page JavaScript - My Private Journal

document.addEventListener('DOMContentLoaded', function() {
    console.log('My Private Journal - Mood Tracker page loaded');
    
    // Initialize mood tracking functionality
    initializeMoodSelector();
    initializeMoodChart();
    initializeMoodStats();
    initializeMoodHistory();
    initializeQuickLog();
    initializeNavigation();
    updateMoodStats();
});

// Initialize mood selector for today
function initializeMoodSelector() {
    const moodOptions = document.querySelectorAll('.today-mood .mood-option');
    let selectedMood = localStorage.getItem('todayMood') || null;
    
    // Set initial mood if stored
    if (selectedMood) {
        const storedMoodOption = document.querySelector(`[data-mood="${selectedMood}"]`);
        if (storedMoodOption) {
            selectMood(storedMoodOption);
        }
    }
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectMood(this);
            selectedMood = this.dataset.mood;
            localStorage.setItem('todayMood', selectedMood);
            
            // Add success feedback
            showMoodLoggedFeedback();
        });
        
        // Add hover effects
        option.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'var(--shadow-md)';
            }
        });
    });
}

// Select mood helper function
function selectMood(selectedOption) {
    const moodOptions = document.querySelectorAll('.today-mood .mood-option');
    
    moodOptions.forEach(option => {
        option.classList.remove('active');
        option.style.transform = 'scale(1)';
        option.style.borderColor = 'transparent';
    });
    
    selectedOption.classList.add('active');
    selectedOption.style.transform = 'scale(1.1)';
    selectedOption.style.borderColor = '#C7B8EA';
    selectedOption.style.boxShadow = '0 8px 25px rgba(199, 184, 234, 0.3)';
    
    // Add gentle bounce animation
    selectedOption.style.transform = 'scale(0.95)';
    setTimeout(() => {
        selectedOption.style.transform = 'scale(1.1)';
    }, 100);
}

// Show mood logged feedback
function showMoodLoggedFeedback() {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid var(--gray-100);
        z-index: 1000;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    feedback.innerHTML = `
        <div style="color: #10B981; font-size: 2rem; margin-bottom: 0.5rem;">✓</div>
        <div style="color: var(--gray-800); font-weight: 500;">Mood logged!</div>
        <div style="color: var(--gray-600); font-size: 0.875rem;">Keep tracking your emotional journey</div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 2000);
}

// Initialize mood chart with mock data
function initializeMoodChart() {
    const chartContainer = document.querySelector('.mood-chart');
    
    if (chartContainer) {
        // Create simple chart using CSS and HTML
        const chartData = generateMockMoodData();
        createMoodChart(chartContainer, chartData);
    }
}

// Generate mock mood data for the last 7 days
function generateMockMoodData() {
    const moods = ['Great', 'Good', 'Okay', 'Low', 'Stressed'];
    const moodColors = {
        'Great': '#10B981',
        'Good': '#34D399', 
        'Okay': '#FBBF24',
        'Low': '#F87171',
        'Stressed': '#EF4444'
    };
    
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const mood = moods[Math.floor(Math.random() * moods.length)];
        data.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            mood: mood,
            color: moodColors[mood],
            value: Math.random() * 80 + 20 // Random height between 20-100
        });
    }
    
    return data;
}

// Create mood chart visualization
function createMoodChart(container, data) {
    container.innerHTML = `
        <div style="display: flex; align-items: end; justify-content: space-around; height: 200px; background: white; border-radius: 1rem; padding: 1.5rem; border: 1px solid var(--gray-100); margin-bottom: 1.5rem;">
            ${data.map(item => `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <div style="
                        width: 2rem; 
                        height: ${item.value}%; 
                        background: ${item.color}; 
                        border-radius: 0.5rem; 
                        transition: all 0.3s ease;
                        cursor: pointer;
                    " 
                    class="chart-bar" 
                    data-mood="${item.mood}"
                    onmouseenter="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'"
                    onmouseleave="this.style.transform='scale(1)'; this.style.boxShadow='none'"
                    title="${item.mood} mood">
                    </div>
                    <span style="font-size: 0.75rem; color: var(--gray-600);">${item.date}</span>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center;">
            <h4 style="margin-bottom: 0.5rem;">7-Day Mood Trend</h4>
            <p style="color: var(--gray-600); font-size: 0.875rem;">Hover over bars to see details</p>
        </div>
    `;
    
    // Add chart animation
    const bars = container.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        bar.style.height = '0%';
        setTimeout(() => {
            bar.style.height = data[index].value + '%';
        }, index * 100);
    });
}

// Initialize mood statistics
function initializeMoodStats() {
    const stats = {
        streak: Math.floor(Math.random() * 15) + 1,
        avgMood: ['Good', 'Great', 'Okay'][Math.floor(Math.random() * 3)],
        totalEntries: Math.floor(Math.random() * 50) + 20,
        topMood: ['Happy', 'Calm', 'Excited'][Math.floor(Math.random() * 3)]
    };
    
    animateStatNumbers(stats);
}

// Animate stat numbers
function animateStatNumbers(stats) {
    const statElements = document.querySelectorAll('.stat-number');
    const statData = [stats.streak, stats.totalEntries];
    
    statElements.forEach((element, index) => {
        if (statData[index]) {
            let currentValue = 0;
            const targetValue = statData[index];
            const increment = targetValue / 30;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(currentValue);
            }, 50);
        }
    });
}

// Update mood stats display
function updateMoodStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
}

// Initialize mood history
function initializeMoodHistory() {
    const historyContainer = document.querySelector('.mood-history');
    
    if (historyContainer) {
        const mockHistory = generateMockMoodHistory();
        displayMoodHistory(historyContainer, mockHistory);
    }
}

// Generate mock mood history
function generateMockMoodHistory() {
    const moods = [
        { name: 'Great', emoji: '😊', color: '#10B981' },
        { name: 'Good', emoji: '😌', color: '#34D399' },
        { name: 'Okay', emoji: '😐', color: '#FBBF24' },
        { name: 'Low', emoji: '😔', color: '#F87171' },
        { name: 'Stressed', emoji: '😰', color: '#EF4444' }
    ];
    
    const history = [];
    const today = new Date();
    
    for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const mood = moods[Math.floor(Math.random() * moods.length)];
        history.push({
            date: date.toLocaleDateString(),
            time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
            mood: mood,
            note: [
                'Had a great day with friends',
                'Feeling peaceful after meditation',
                'School was challenging today',
                'Worried about upcoming exams',
                'Excited about weekend plans'
            ][Math.floor(Math.random() * 5)]
        });
    }
    
    return history;
}

// Display mood history
function displayMoodHistory(container, history) {
    container.innerHTML = history.map((entry, index) => `
        <div class="history-entry" style="
            background: white;
            border-radius: 1rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-100);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(-20px);
        ">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                <div style="
                    width: 3rem;
                    height: 3rem;
                    background: ${entry.mood.color};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                ">${entry.mood.emoji}</div>
                <div>
                    <div style="font-weight: 500; color: var(--gray-800);">${entry.mood.name}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${entry.date} at ${entry.time}</div>
                </div>
            </div>
            <p style="color: var(--gray-700); font-size: 0.875rem; margin: 0; font-style: italic;">"${entry.note}"</p>
        </div>
    `).join('');
    
    // Animate entries
    const entries = container.querySelectorAll('.history-entry');
    entries.forEach((entry, index) => {
        setTimeout(() => {
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        }, index * 150);
        
        // Add hover effect
        entry.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        entry.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
}

// Initialize quick log functionality
function initializeQuickLog() {
    const quickLogBtn = document.querySelector('.quick-log-btn');
    
    if (quickLogBtn) {
        quickLogBtn.addEventListener('click', function() {
            showQuickLogModal();
        });
    }
}

// Show quick log modal
function showQuickLogModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 1.5rem;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <h3 style="text-align: center; margin-bottom: 1.5rem;">Quick Mood Log</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                <button class="quick-mood" data-mood="great" style="padding: 1rem; border: none; border-radius: 1rem; background: #10B981; color: white; cursor: pointer; transition: transform 0.2s;">😊 Great</button>
                <button class="quick-mood" data-mood="good" style="padding: 1rem; border: none; border-radius: 1rem; background: #34D399; color: white; cursor: pointer; transition: transform 0.2s;">😌 Good</button>
                <button class="quick-mood" data-mood="okay" style="padding: 1rem; border: none; border-radius: 1rem; background: #FBBF24; color: white; cursor: pointer; transition: transform 0.2s;">😐 Okay</button>
                <button class="quick-mood" data-mood="low" style="padding: 1rem; border: none; border-radius: 1rem; background: #F87171; color: white; cursor: pointer; transition: transform 0.2s;">😔 Low</button>
                <button class="quick-mood" data-mood="stressed" style="padding: 1rem; border: none; border-radius: 1rem; background: #EF4444; color: white; cursor: pointer; transition: transform 0.2s;">😰 Stressed</button>
                <button class="quick-mood" data-mood="excited" style="padding: 1rem; border: none; border-radius: 1rem; background: #8B5CF6; color: white; cursor: pointer; transition: transform 0.2s;">🤗 Excited</button>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button id="cancel-quick-log" style="flex: 1; padding: 0.75rem; border: 1px solid var(--gray-300); background: white; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
                <button id="save-quick-log" style="flex: 1; padding: 0.75rem; border: none; background: #C7B8EA; color: white; border-radius: 0.5rem; cursor: pointer;" disabled>Save</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
    
    // Quick mood selection
    let selectedQuickMood = null;
    modal.querySelectorAll('.quick-mood').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.quick-mood').forEach(b => b.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.1)';
            selectedQuickMood = this.dataset.mood;
            modal.querySelector('#save-quick-log').disabled = false;
            modal.querySelector('#save-quick-log').style.background = '#C7B8EA';
        });
        
        btn.addEventListener('mouseenter', function() {
            if (selectedQuickMood !== this.dataset.mood) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (selectedQuickMood !== this.dataset.mood) {
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Modal controls
    modal.querySelector('#cancel-quick-log').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#save-quick-log').addEventListener('click', () => {
        if (selectedQuickMood) {
            localStorage.setItem('todayMood', selectedQuickMood);
            showMoodLoggedFeedback();
            closeModal(modal);
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

// Close modal helper
function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('div').style.transform = 'scale(0.9)';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Initialize navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(199, 184, 234, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple keyframes if not already added
if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('Mood Tracker functionality initialized 😊');