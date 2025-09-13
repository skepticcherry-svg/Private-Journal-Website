// Settings page JavaScript - My Private Journal

document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings page loaded ⚙️');
    
    initializeToggleSwitches();
    initializeSelectInputs();
    initializeActionButtons();
    loadSavedSettings();
});

// Initialize toggle switches
function initializeToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch');
    
    toggles.forEach(toggle => {
        const setting = toggle.dataset.setting;
        
        // Load saved state
        const isActive = getSavedSetting(setting, true);
        if (isActive) {
            toggle.classList.add('active');
        }
        
        // Add click handler
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const newState = this.classList.contains('active');
            saveSetting(setting, newState);
            showFeedback(`${getSettingDisplayName(setting)} ${newState ? 'enabled' : 'disabled'}`);
        });
    });
}

// Initialize select inputs
function initializeSelectInputs() {
    const selects = document.querySelectorAll('.select-input');
    
    selects.forEach(select => {
        const setting = select.dataset.setting;
        
        // Load saved value
        const savedValue = getSavedSetting(setting, select.value);
        select.value = savedValue;
        
        // Add change handler
        select.addEventListener('change', function() {
            saveSetting(setting, this.value);
            showFeedback(`${getSettingDisplayName(setting)} updated`);
        });
    });
}

// Initialize action buttons
function initializeActionButtons() {
    const buttons = document.querySelectorAll('[data-action]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleAction(action);
        });
    });
}

// Handle different actions
function handleAction(action) {
    switch (action) {
        case 'export-journal':
            exportJournalEntries();
            break;
        case 'export-cbt':
            exportCBTEntries();
            break;
        case 'clear-all':
            confirmClearAllData();
            break;
    }
}

// Export journal entries
function exportJournalEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    if (entries.length === 0) {
        showFeedback('No journal entries to export', 'warning');
        return;
    }
    
    downloadJSON(entries, 'journal-entries.json');
    showFeedback('Journal entries exported successfully', 'success');
}

// Export CBT entries
function exportCBTEntries() {
    const entries = JSON.parse(localStorage.getItem('cbtHistory') || '[]');
    
    if (entries.length === 0) {
        showFeedback('No CBT entries to export', 'warning');
        return;
    }
    
    downloadJSON(entries, 'cbt-entries.json');
    showFeedback('CBT entries exported successfully', 'success');
}

// Confirm clear all data
function confirmClearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        clearAllData();
        showFeedback('All data cleared', 'success');
    }
}

// Clear all data
function clearAllData() {
    const keysToRemove = [
        'journalEntries',
        'moodHistory', 
        'cbtHistory',
        'completedCBTPrompts',
        'journal-draft',
        'todayMood',
        'journalSettings'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Reset all toggles
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.classList.remove('active');
    });
    
    // Reset selects
    document.querySelectorAll('.select-input').forEach(select => {
        select.selectedIndex = 0;
    });
}

// Load saved settings
function loadSavedSettings() {
    const settings = JSON.parse(localStorage.getItem('journalSettings') || '{}');
    
    // Update toggles
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        const setting = toggle.dataset.setting;
        const isActive = settings[setting] !== false; // Default to true
        
        if (isActive) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    });
    
    // Update selects
    document.querySelectorAll('.select-input').forEach(select => {
        const setting = select.dataset.setting;
        if (settings[setting]) {
            select.value = settings[setting];
        }
    });
}

// Utility functions
function getSavedSetting(key, defaultValue) {
    const settings = JSON.parse(localStorage.getItem('journalSettings') || '{}');
    return settings[key] !== undefined ? settings[key] : defaultValue;
}

function saveSetting(key, value) {
    const settings = JSON.parse(localStorage.getItem('journalSettings') || '{}');
    settings[key] = value;
    localStorage.setItem('journalSettings', JSON.stringify(settings));
}

function getSettingDisplayName(key) {
    const names = {
        'autolock': 'Auto-lock',
        'biometric': 'Biometric login',
        'dailyreminder': 'Daily reminders',
        'remindertime': 'Reminder time',
        'darkmode': 'Dark mode',
        'textsize': 'Text size'
    };
    return names[key] || key;
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

function showFeedback(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-100%);
        transition: all 0.3s ease;
        font-size: 0.875rem;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

console.log('Settings functionality initialized ⚙️');