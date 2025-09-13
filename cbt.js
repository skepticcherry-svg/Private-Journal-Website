// CBT Prompts page JavaScript - My Private Journal

document.addEventListener('DOMContentLoaded', function() {
    console.log('My Private Journal - CBT Prompts page loaded');
    
    // Initialize CBT functionality
    initializeProgressTracker();
    initializeCBTCards();
    initializeActionButtons();
    initializeModalSystem();
    initializeNavigation();
    updateProgressDisplay();
});

// CBT Prompts data
const cbtPrompts = [
    {
        id: 'cognitive-restructuring',
        title: "Cognitive Restructuring",
        description: "Challenge negative thought patterns and develop more balanced perspectives.",
        prompt: "Write down a negative thought you had today. What evidence supports it? What evidence challenges it? How could you reframe this thought more realistically?",
        color: "linear-gradient(135deg, #E879F9 0%, #C084FC 100%)",
        borderColor: "#C084FC",
        icon: "💡",
        category: "Thought Challenging"
    },
    {
        id: 'behavioral-activation',
        title: "Behavioral Activation",
        description: "Identify positive actions that can boost your mood and energy levels.",
        prompt: "List one small, positive action you can take today to boost your mood. How will you make time for it? What obstacles might you face, and how can you overcome them?",
        color: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
        borderColor: "#10B981",
        icon: "📈",
        category: "Action Planning"
    },
    {
        id: 'thought-record',
        title: "Thought Record",
        description: "Track situations, emotions, and thoughts to identify patterns.",
        prompt: "Describe a recent situation that triggered strong emotions. What automatic thoughts came up? Rate the intensity of your emotions (1-10). What would you tell a friend in this situation?",
        color: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
        borderColor: "#3B82F6",
        icon: "📝",
        category: "Self-Monitoring"
    },
    {
        id: 'gratitude-reframe',
        title: "Gratitude Reframe",
        description: "Shift focus to positive aspects during challenging moments.",
        prompt: "Write down three things you're grateful for today. How do these positive aspects change your perspective on any current challenges?",
        color: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
        borderColor: "#F59E0B",
        icon: "🙏",
        category: "Positive Focus"
    },
    {
        id: 'mindful-awareness',
        title: "Mindful Awareness",
        description: "Practice present-moment awareness to reduce anxiety and overthinking.",
        prompt: "Take five minutes to practice mindfulness. What are 3 things you can see, 2 things you can hear, and 1 thing you can feel right now? How does this grounding exercise affect your current emotional state?",
        color: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
        borderColor: "#8B5CF6",
        icon: "🧘",
        category: "Mindfulness"
    },
    {
        id: 'problem-solving',
        title: "Problem Solving",
        description: "Break down challenges into manageable steps and solutions.",
        prompt: "Identify a current challenge you're facing. Break it down into smaller parts. What are 3 possible solutions? What's one small step you can take today toward solving it?",
        color: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
        borderColor: "#0D9488",
        icon: "🧩",
        category: "Solution Focus"
    }
];

// Initialize progress tracker
function initializeProgressTracker() {
    const completedPrompts = JSON.parse(localStorage.getItem('completedCBTPrompts') || '[]');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const completionPercentage = (completedPrompts.length / cbtPrompts.length) * 100;
        
        // Animate progress bar
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = completionPercentage + '%';
        }, 500);
        
        progressText.textContent = `${completedPrompts.length}/${cbtPrompts.length}`;
    }
    
    // Update streak counter
    const streakElement = document.querySelector('.streak-counter');
    if (streakElement) {
        const streak = calculateCBTStreak();
        animateNumber(streakElement, streak);
    }
}

// Calculate CBT streak
function calculateCBTStreak() {
    const cbtHistory = JSON.parse(localStorage.getItem('cbtHistory') || '[]');
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateString = checkDate.toDateString();
        
        const hasEntry = cbtHistory.some(entry => 
            new Date(entry.date).toDateString() === dateString
        );
        
        if (hasEntry) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// Animate number counter
function animateNumber(element, targetValue) {
    let currentValue = 0;
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

// Initialize CBT cards
function initializeCBTCards() {
    const cardsContainer = document.querySelector('.cbt-cards-grid');
    const completedPrompts = JSON.parse(localStorage.getItem('completedCBTPrompts') || '[]');
    
    if (cardsContainer) {
        cardsContainer.innerHTML = cbtPrompts.map((prompt, index) => {
            const isCompleted = completedPrompts.includes(prompt.id);
            return createCBTCard(prompt, index, isCompleted);
        }).join('');
        
        // Add event listeners to cards
        addCardEventListeners();
        
        // Animate cards on load
        animateCardsOnLoad();
    }
}

// Create CBT card HTML
function createCBTCard(prompt, index, isCompleted) {
    return `
        <div class="cbt-card" data-prompt-id="${prompt.id}" style="
            background: ${prompt.color};
            border-radius: 1.5rem;
            padding: 1.5rem;
            border: 2px solid ${prompt.borderColor};
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            position: relative;
            overflow: hidden;
        ">
            ${isCompleted ? `
                <div style="
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    background: rgba(16, 185, 129, 0.9);
                    color: white;
                    border-radius: 50%;
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                ">✓</div>
            ` : ''}
            
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                <div style="
                    font-size: 1.5rem;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    width: 3rem;
                    height: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">${prompt.icon}</div>
                <div>
                    <h3 style="color: white; margin: 0; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">${prompt.title}</h3>
                    <div style="
                        background: rgba(255, 255, 255, 0.6);
                        color: rgba(0, 0, 0, 0.7);
                        padding: 0.25rem 0.75rem;
                        border-radius: 1rem;
                        font-size: 0.75rem;
                        display: inline-block;
                        margin-top: 0.25rem;
                    ">${prompt.category}</div>
                </div>
            </div>
            
            <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 1rem; line-height: 1.5; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">
                ${prompt.description}
            </p>
            
            <div style="
                background: rgba(255, 255, 255, 0.9);
                border-radius: 1rem;
                padding: 1rem;
                margin-bottom: 1rem;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            ">
                <p style="
                    color: rgba(0, 0, 0, 0.8);
                    font-size: 0.875rem;
                    font-style: italic;
                    margin: 0;
                    line-height: 1.4;
                ">"${prompt.prompt.substring(0, 120)}..."</p>
            </div>
            
            <button class="start-writing-btn" style="
                width: 100%;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.9);
                hover:background: rgba(255, 255, 255, 1);
                border: none;
                border-radius: 0.75rem;
                color: rgba(0, 0, 0, 0.8);
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            ">
                <span style="font-size: 1rem;">✍️</span>
                Start Writing
            </button>
        </div>
    `;
}

// Add event listeners to cards
function addCardEventListeners() {
    const cards = document.querySelectorAll('.cbt-card');
    
    cards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
        
        // Click to open writing modal
        card.addEventListener('click', function() {
            const promptId = this.dataset.promptId;
            const prompt = cbtPrompts.find(p => p.id === promptId);
            if (prompt) {
                openWritingModal(prompt);
            }
        });
        
        // Start writing button
        const startBtn = card.querySelector('.start-writing-btn');
        startBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 1)';
            this.style.transform = 'scale(1.05)';
        });
        
        startBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.9)';
            this.style.transform = 'scale(1)';
        });
    });
}

// Animate cards on load
function animateCardsOnLoad() {
    const cards = document.querySelectorAll('.cbt-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Initialize action buttons
function initializeActionButtons() {
    const newEntryBtn = document.querySelector('#newEntry');
    const randomBtn = document.querySelector('#randomPrompt');
    const exportBtn = document.querySelector('#exportEntries');
    
    if (newEntryBtn) {
        newEntryBtn.addEventListener('click', function() {
            // Show prompt selection modal
            showPromptSelectionModal();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    if (randomBtn) {
        randomBtn.addEventListener('click', function() {
            const randomPrompt = cbtPrompts[Math.floor(Math.random() * cbtPrompts.length)];
            openWritingModal(randomPrompt);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportCBTEntries();
            
            // Add success feedback
            this.textContent = 'Exported!';
            this.style.background = '#10B981';
            setTimeout(() => {
                this.textContent = 'Export CBT Entries';
                this.style.background = '';
            }, 2000);
        });
    }
}

// Export CBT entries functionality
function exportCBTEntries() {
    const cbtHistory = JSON.parse(localStorage.getItem('cbtHistory') || '[]');
    
    if (cbtHistory.length === 0) {
        showNotification('No CBT entries to export yet!', 'info');
        return;
    }
    
    const exportData = cbtHistory.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        technique: entry.technique,
        prompt: entry.prompt,
        response: entry.response,
        wordCount: entry.wordCount
    }));
    
    const csvContent = convertToCSV(exportData);
    downloadCSV(csvContent, 'cbt-journal-entries.csv');
    
    showNotification('CBT entries exported successfully!', 'success');
}

// Convert data to CSV format
function convertToCSV(data) {
    const headers = ['Date', 'Technique', 'Prompt', 'Response', 'Word Count'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = [
            row.date,
            `"${row.technique}"`,
            `"${row.prompt.replace(/"/g, '""')}"`,
            `"${row.response.replace(/"/g, '""')}"`,
            row.wordCount
        ];
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

// Download CSV file
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize modal system
function initializeModalSystem() {
    // Modal will be created dynamically when needed
}

// Open writing modal
function openWritingModal(prompt) {
    const modal = document.createElement('div');
    modal.className = 'writing-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(4px);
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 1.5rem;
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        ">
            <div style="padding: 2rem;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="
                        font-size: 2rem;
                        background: ${prompt.color};
                        border-radius: 50%;
                        width: 4rem;
                        height: 4rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    ">${prompt.icon}</div>
                    <div>
                        <h2 style="margin: 0; color: var(--gray-800);">${prompt.title}</h2>
                        <p style="margin: 0.25rem 0 0 0; color: var(--gray-600); font-size: 0.875rem;">${prompt.category}</p>
                    </div>
                    <button class="close-modal" style="
                        margin-left: auto;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--gray-500);
                        border-radius: 50%;
                        width: 2.5rem;
                        height: 2.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.2s ease;
                    " onmouseenter="this.style.background='var(--gray-100)'" onmouseleave="this.style.background='none'">×</button>
                </div>
                
                <div style="
                    background: linear-gradient(135deg, ${prompt.color});
                    border-radius: 1rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: white;
                ">
                    <h3 style="margin: 0 0 0.75rem 0; color: white;">Reflection Prompt</h3>
                    <p style="margin: 0; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">${prompt.prompt}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--gray-700); font-weight: 500;">Your Reflection</label>
                    <textarea class="cbt-textarea" placeholder="Take your time to reflect deeply on this prompt. There's no right or wrong answer - just be honest with yourself..." style="
                        width: 100%;
                        height: 200px;
                        padding: 1rem;
                        border: 2px solid var(--gray-200);
                        border-radius: 0.75rem;
                        font-size: 1rem;
                        line-height: 1.6;
                        resize: vertical;
                        min-height: 200px;
                        transition: border-color 0.2s ease;
                        font-family: inherit;
                        background: white;
                        color: #374151;
                        box-sizing: border-box;
                    " onfocus="this.style.borderColor='${prompt.borderColor}'; this.style.boxShadow='0 0 0 3px rgba(199, 184, 234, 0.1)'" onblur="this.style.borderColor='var(--gray-200)'; this.style.boxShadow='none'"></textarea>
                </div>
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                    <div class="word-count" style="color: var(--gray-500); font-size: 0.875rem;">0 words</div>
                    <div class="writing-time" style="color: var(--gray-500); font-size: 0.875rem;">0:00</div>
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button class="cancel-btn" style="
                        flex: 1;
                        padding: 0.75rem;
                        border: 1px solid var(--gray-300);
                        background: white;
                        border-radius: 0.75rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    " onmouseenter="this.style.background='var(--gray-50)'" onmouseleave="this.style.background='white'">Cancel</button>
                    <button class="save-cbt-btn" style="
                        flex: 2;
                        padding: 0.75rem;
                        border: none;
                        background: ${prompt.color};
                        color: white;
                        border-radius: 0.75rem;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        opacity: 0.6;
                    " disabled onmouseenter="if(!this.disabled) this.style.transform='scale(1.02)'" onmouseleave="this.style.transform='scale(1)'">Save Reflection</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
    
    // Initialize modal functionality
    initializeModalFunctionality(modal, prompt);
}

// Initialize modal functionality
function initializeModalFunctionality(modal, prompt) {
    const textarea = modal.querySelector('.cbt-textarea');
    const wordCount = modal.querySelector('.word-count');
    const writingTime = modal.querySelector('.writing-time');
    const saveBtn = modal.querySelector('.save-cbt-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const closeBtn = modal.querySelector('.close-modal');
    
    let startTime = Date.now();
    let timeInterval;
    
    // Start timing
    timeInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        writingTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Word count and save button state
    textarea.addEventListener('input', function() {
        const text = this.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = `${words} words`;
        
        if (words > 0) {
            saveBtn.disabled = false;
            saveBtn.style.opacity = '1';
        } else {
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.6';
        }
        
        // Auto-resize
        this.style.height = 'auto';
        this.style.height = Math.max(200, this.scrollHeight) + 'px';
    });
    
    // Save functionality
    saveBtn.addEventListener('click', function() {
        if (!this.disabled) {
            saveCBTEntry(prompt, textarea.value, timeInterval);
            closeModal(modal, timeInterval);
            showNotification('CBT reflection saved successfully!', 'success');
        }
    });
    
    // Cancel/close functionality
    [cancelBtn, closeBtn].forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal, timeInterval));
    });
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal, timeInterval);
        }
    });
    
    // Focus on textarea
    setTimeout(() => {
        textarea.focus();
    }, 300);
}

// Save CBT entry
function saveCBTEntry(prompt, response, timeInterval) {
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        technique: prompt.title,
        category: prompt.category,
        prompt: prompt.prompt,
        response: response,
        wordCount: response.trim() ? response.trim().split(/\s+/).length : 0,
        timeSpent: Math.floor((Date.now() - Date.now()) / 1000) // This would be calculated properly in real implementation
    };
    
    // Save to history
    const cbtHistory = JSON.parse(localStorage.getItem('cbtHistory') || '[]');
    cbtHistory.unshift(entry);
    localStorage.setItem('cbtHistory', JSON.stringify(cbtHistory));
    
    // Mark as completed
    const completedPrompts = JSON.parse(localStorage.getItem('completedCBTPrompts') || '[]');
    if (!completedPrompts.includes(prompt.id)) {
        completedPrompts.push(prompt.id);
        localStorage.setItem('completedCBTPrompts', JSON.stringify(completedPrompts));
    }
    
    // Update progress display
    updateProgressDisplay();
    
    // Refresh entries display
    loadAndDisplayCBTEntries();
    
    // Update card to show completion
    const card = document.querySelector(`[data-prompt-id="${prompt.id}"]`);
    if (card && !card.querySelector('.completion-badge')) {
        const badge = document.createElement('div');
        badge.className = 'completion-badge';
        badge.innerHTML = '✓';
        badge.style.cssText = `
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            animation: bounceIn 0.5s ease;
        `;
        card.appendChild(badge);
    }
}

// Close modal helper
function closeModal(modal, timeInterval) {
    if (timeInterval) {
        clearInterval(timeInterval);
    }
    
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Update progress display
function updateProgressDisplay() {
    const completedPrompts = JSON.parse(localStorage.getItem('completedCBTPrompts') || '[]');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const completionPercentage = (completedPrompts.length / cbtPrompts.length) * 100;
        progressBar.style.width = completionPercentage + '%';
        progressText.textContent = `${completedPrompts.length}/${cbtPrompts.length}`;
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
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

// Add CSS animations
if (!document.querySelector('#cbt-animations')) {
    const style = document.createElement('style');
    style.id = 'cbt-animations';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes bounceIn {
            0% {
                transform: scale(0.3);
                opacity: 0;
            }
            50% {
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Load and display saved CBT entries
function loadAndDisplayCBTEntries() {
    const container = document.querySelector('.cbt-entries-container');
    if (!container) return;
    
    const cbtHistory = JSON.parse(localStorage.getItem('cbtHistory') || '[]');
    
    if (cbtHistory.length === 0) {
        container.innerHTML = `
            <div style="
                text-align: center;
                padding: 2rem;
                color: var(--gray-500);
                font-style: italic;
                background: white;
                border-radius: 1rem;
                border: 1px solid var(--gray-100);
            ">
                No CBT entries yet. Start with a prompt above to begin your journey!
            </div>
        `;
        return;
    }
    
    // Display recent entries (last 3)
    container.innerHTML = '';
    cbtHistory.slice(0, 3).forEach((entry, index) => {
        const entryCard = createCBTEntryCard(entry);
        entryCard.style.opacity = '0';
        entryCard.style.transform = 'translateY(20px)';
        container.appendChild(entryCard);
        
        // Staggered animation
        setTimeout(() => {
            entryCard.style.opacity = '1';
            entryCard.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Create CBT entry card
function createCBTEntryCard(entry) {
    const card = document.createElement('div');
    card.style.cssText = `
        background: white;
        border-radius: 1rem;
        padding: 1.25rem;
        margin-bottom: 1rem;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--gray-100);
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    // Get the color based on the technique
    const prompt = cbtPrompts.find(p => p.title === entry.technique);
    const promptColor = prompt ? prompt.color : 'linear-gradient(135deg, #C7B8EA 0%, #A78BFA 100%)';
    
    const preview = entry.response.length > 150 ? entry.response.substring(0, 150) + '...' : entry.response;
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h4 style="margin: 0; color: var(--gray-800); font-size: 1rem;">${entry.technique}</h4>
            <span style="font-size: 0.75rem; color: var(--gray-500);">${new Date(entry.date).toLocaleDateString()}</span>
        </div>
        <div style="
            background: ${promptColor};
            color: rgba(255, 255, 255, 0.9);
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
            display: inline-block;
        ">${entry.category}</div>
        <div style="color: var(--gray-700); line-height: 1.5; margin-bottom: 0.75rem; font-size: 0.875rem;">${preview}</div>
        <div style="display: flex; justify-content: between; align-items: center; color: var(--gray-500); font-size: 0.75rem;">
            <span>${entry.wordCount} words</span>
        </div>
    `;
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-sm)';
    });
    
    // Add click to view functionality
    card.addEventListener('click', function() {
        viewCBTEntryModal(entry);
    });
    
    return card;
}

// View CBT entry modal
function viewCBTEntryModal(entry) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(4px);
    `;
    
    // Get the color based on the technique
    const prompt = cbtPrompts.find(p => p.title === entry.technique);
    const promptColor = prompt ? prompt.color : 'linear-gradient(135deg, #C7B8EA 0%, #A78BFA 100%)';
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 1.5rem;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        ">
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <h2 style="margin: 0;">${entry.technique}</h2>
                        <p style="margin: 0.5rem 0 0 0; color: var(--gray-600); font-size: 0.875rem;">${new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                    <button style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--gray-500);
                        border-radius: 50%;
                        width: 2.5rem;
                        height: 2.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " onclick="this.closest('[style*=\"fixed\"]').remove()">×</button>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <div style="
                        background: ${promptColor};
                        color: rgba(255, 255, 255, 0.9);
                        padding: 0.75rem 1rem;
                        border-radius: 0.75rem;
                        font-size: 0.875rem;
                        margin-bottom: 1rem;
                    ">${entry.category}</div>
                </div>
                
                <div style="
                    color: var(--gray-700);
                    line-height: 1.6;
                    white-space: pre-wrap;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: var(--gray-50);
                    border-radius: 0.75rem;
                ">${entry.response}</div>
                
                <div style="color: var(--gray-500); font-size: 0.875rem; text-align: center;">
                    ${entry.wordCount} words
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show prompt selection modal for new entry
function showPromptSelectionModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(4px);
    `;
    
    // Add free-form option
    const freeFormPrompt = {
        id: 'free-form',
        title: "Free Form Reflection",
        description: "Write about whatever is on your mind right now.",
        prompt: "Take a moment to reflect on anything that's currently on your mind. There are no rules - just let your thoughts flow naturally onto the page.",
        color: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
        borderColor: "#8B5CF6",
        icon: "✍️",
        category: "Free Writing"
    };
    
    const allPrompts = [freeFormPrompt, ...cbtPrompts];
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 1.5rem;
            width: 95%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        ">
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0; color: var(--gray-800);">Choose a Prompt</h2>
                    <button class="close-prompt-modal" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--gray-500);
                        border-radius: 50%;
                        width: 2.5rem;
                        height: 2.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                ">
                    ${allPrompts.map(prompt => `
                        <div class="prompt-option" data-prompt-id="${prompt.id}" style="
                            background: ${prompt.color};
                            border-radius: 1rem;
                            padding: 1.5rem;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            color: white;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                                <div style="font-size: 1.5rem;">${prompt.icon}</div>
                                <div>
                                    <h3 style="margin: 0; color: white; font-size: 1rem;">${prompt.title}</h3>
                                    <div style="
                                        background: rgba(255, 255, 255, 0.2);
                                        color: rgba(255, 255, 255, 0.9);
                                        padding: 0.125rem 0.5rem;
                                        border-radius: 0.5rem;
                                        font-size: 0.75rem;
                                        margin-top: 0.25rem;
                                        display: inline-block;
                                    ">${prompt.category}</div>
                                </div>
                            </div>
                            <p style="
                                color: rgba(255, 255, 255, 0.9);
                                margin: 0;
                                font-size: 0.875rem;
                                line-height: 1.4;
                            ">${prompt.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
    
    // Add click handlers
    modal.querySelectorAll('.prompt-option').forEach(option => {
        option.addEventListener('click', function() {
            const promptId = this.dataset.promptId;
            const selectedPrompt = allPrompts.find(p => p.id === promptId);
            modal.remove();
            openWritingModal(selectedPrompt);
        });
        
        // Hover effects
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Close handlers
    modal.querySelector('.close-prompt-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update the initialization to load entries
document.addEventListener('DOMContentLoaded', function() {
    console.log('CBT page loaded 🧠');
    
    initializeActionButtons();
    renderPromptCards();
    updateProgressDisplay();
    loadAndDisplayCBTEntries();
    
    // Add some visual flair
    document.body.style.background = 'linear-gradient(135deg, #fefefe 0%, #f8fafc 100%)';
});

console.log('CBT Prompts functionality initialized 🧠');