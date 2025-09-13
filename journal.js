// Journal page JavaScript - My Private Journal

document.addEventListener('DOMContentLoaded', function() {
    console.log('My Private Journal - Journal page loaded');
    
    // Initialize journal functionality
    initializeMoodSelector();
    initializeTextEditor();
    initializeAutoSave();
    initializeWordCount();
    initializePreviousEntries();
    initializeNavigation();
});

// Initialize mood selector functionality
function initializeMoodSelector() {
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = null;
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            moodOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.style.borderColor = 'transparent';
                opt.style.background = 'var(--gray-50)';
            });
            
            // Add active class to selected option
            this.classList.add('active');
            this.style.borderColor = '#C7B8EA';
            this.style.background = 'rgba(199, 184, 234, 0.1)';
            
            selectedMood = this.dataset.mood;
            
            // Add gentle bounce animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Add hover effects
        option.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'rgba(199, 184, 234, 0.05)';
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'var(--gray-50)';
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Initialize text editor functionality
function initializeTextEditor() {
    const textarea = document.querySelector('#journalContent');
    const placeholder = "What's on your mind today? Share your thoughts, feelings, or experiences...";
    
    if (textarea) {
        textarea.placeholder = placeholder;
        
        // Add focus effects
        textarea.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#C7B8EA';
            this.parentElement.style.boxShadow = '0 0 0 3px rgba(199, 184, 234, 0.1)';
        });
        
        textarea.addEventListener('blur', function() {
            this.parentElement.style.borderColor = 'var(--gray-200)';
            this.parentElement.style.boxShadow = 'var(--shadow-md)';
        });
        
        // Auto-resize textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(200, this.scrollHeight) + 'px';
        });
        
        // Add typing animation effect
        let typingTimer;
        textarea.addEventListener('input', function() {
            clearTimeout(typingTimer);
            this.style.borderLeft = '4px solid #C7B8EA';
            
            typingTimer = setTimeout(() => {
                this.style.borderLeft = '4px solid var(--gray-200)';
            }, 1000);
        });
    }
}

// Initialize auto-save functionality
function initializeAutoSave() {
    const textarea = document.querySelector('#journalContent');
    const saveIndicator = document.createElement('div');
    saveIndicator.className = 'save-indicator';
    saveIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 8px 16px;
        background: #10B981;
        color: white;
        border-radius: 20px;
        font-size: 0.875rem;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    saveIndicator.textContent = 'Auto-saved';
    document.body.appendChild(saveIndicator);
    
    let autoSaveTimer;
    
    if (textarea) {
        textarea.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            
            autoSaveTimer = setTimeout(() => {
                // Simulate auto-save
                const content = this.value;
                if (content.trim()) {
                    localStorage.setItem('journal-draft', content);
                    showSaveIndicator();
                }
            }, 2000);
        });
        
        // Load draft on page load
        const draft = localStorage.getItem('journal-draft');
        if (draft) {
            textarea.value = draft;
            textarea.dispatchEvent(new Event('input')); // Trigger auto-resize
        }
    }
    
    function showSaveIndicator() {
        saveIndicator.style.opacity = '1';
        setTimeout(() => {
            saveIndicator.style.opacity = '0';
        }, 2000);
    }
}

// Initialize word count functionality
function initializeWordCount() {
    const textarea = document.querySelector('#journalContent');
    const wordCountElement = document.querySelector('#wordCount');
    
    if (textarea && wordCountElement) {
        function updateWordCount() {
            const text = textarea.value;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const characters = text.length;
            
            wordCountElement.textContent = `${words} words • ${characters} characters`;
            
            // Add color coding based on length
            if (words > 100) {
                wordCountElement.style.color = '#10B981'; // Green for substantial entries
            } else if (words > 50) {
                wordCountElement.style.color = '#F59E0B'; // Orange for moderate entries
            } else {
                wordCountElement.style.color = 'var(--gray-500)'; // Gray for short entries
            }
        }
        
        textarea.addEventListener('input', updateWordCount);
        updateWordCount(); // Initial count
    }
}

// Initialize previous entries functionality
function initializePreviousEntries() {
    const entriesContainer = document.querySelector('.recent-entries');
    
    if (entriesContainer) {
        loadAndDisplayEntries();
    }
}

// Load and display saved entries
function loadAndDisplayEntries() {
    const entriesContainer = document.querySelector('.recent-entries');
    if (!entriesContainer) return;
    
    // Clear existing entries except the header
    const header = entriesContainer.querySelector('h3');
    entriesContainer.innerHTML = '';
    if (header) {
        entriesContainer.appendChild(header);
    } else {
        const newHeader = document.createElement('h3');
        newHeader.textContent = 'Recent Entries';
        newHeader.style.cssText = 'margin-bottom: 1.5rem; color: var(--gray-800);';
        entriesContainer.appendChild(newHeader);
    }
    
    // Load entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    if (savedEntries.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: var(--gray-500);
            font-style: italic;
        `;
        emptyState.textContent = 'No entries yet. Start writing your first journal entry!';
        entriesContainer.appendChild(emptyState);
        return;
    }
    
    // Display entries (most recent first)
    savedEntries.slice(0, 5).forEach((entry, index) => {
        const entryElement = createEntryElement(entry);
        entryElement.style.opacity = '0';
        entryElement.style.transform = 'translateY(20px)';
        entriesContainer.appendChild(entryElement);
        
        // Staggered animation
        setTimeout(() => {
            entryElement.style.opacity = '1';
            entryElement.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Save journal entry function
function saveJournalEntry(isDraft = false) {
    const titleInput = document.querySelector('#journalTitle');
    const contentTextarea = document.querySelector('#journalContent');
    const selectedMoodElement = document.querySelector('.mood-option.active');
    const saveButton = document.querySelector('#saveEntry');
    const saveAsDraftButton = document.querySelector('#saveAsDraft');
    
    if (!contentTextarea || !contentTextarea.value.trim()) {
        showNotification('Please write something before saving!', 'warning');
        return;
    }
    
    const title = titleInput ? titleInput.value.trim() : '';
    const content = contentTextarea.value.trim();
    const mood = selectedMoodElement ? selectedMoodElement.dataset.mood : 'neutral';
    const wordCount = content.split(/\s+/).length;
    
    const entry = {
        id: Date.now(),
        title: title || 'Untitled Entry',
        content: content,
        mood: mood,
        wordCount: wordCount,
        isDraft: isDraft,
        date: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        })
    };
    
    // Save to localStorage
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    savedEntries.unshift(entry); // Add to beginning of array
    localStorage.setItem('journalEntries', JSON.stringify(savedEntries));
    
    // Clear draft
    localStorage.removeItem('journal-draft');
    
    // Update button state
    const buttonToUpdate = isDraft ? saveAsDraftButton : saveButton;
    const originalText = buttonToUpdate.textContent;
    
    buttonToUpdate.textContent = isDraft ? 'Saving Draft...' : 'Saving...';
    buttonToUpdate.disabled = true;
    
    setTimeout(() => {
        buttonToUpdate.textContent = isDraft ? 'Saved as Draft!' : 'Saved!';
        buttonToUpdate.style.background = '#10B981';
        
        // Clear form
        if (!isDraft) {
            if (titleInput) titleInput.value = '';
            contentTextarea.value = '';
            if (selectedMoodElement) {
                selectedMoodElement.classList.remove('active');
                selectedMoodElement.style.borderColor = 'transparent';
                selectedMoodElement.style.background = 'var(--gray-50)';
            }
        }
        
        // Refresh entries display
        loadAndDisplayEntries();
        
        setTimeout(() => {
            buttonToUpdate.textContent = originalText;
            buttonToUpdate.style.background = '';
            buttonToUpdate.disabled = false;
        }, 2000);
    }, 1000);
    
    showNotification(isDraft ? 'Entry saved as draft!' : 'Entry saved successfully!', 'success');
}

// Create entry element for previous entries
function createEntryElement(entry) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-item';
    entryDiv.style.cssText = `
        background: white;
        border-radius: 1rem;
        padding: 1.25rem;
        margin-bottom: 1rem;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--gray-100);
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const preview = entry.content.length > 120 ? entry.content.substring(0, 120) + '...' : entry.content;
    const moodColor = getMoodColor(entry.mood);
    
    entryDiv.innerHTML = `
        <div class="entry-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="color: var(--gray-600); font-size: 0.875rem;">${entry.formattedDate || entry.date}</span>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="mood-dot" style="background-color: ${moodColor}; width: 8px; height: 8px; border-radius: 50%;"></div>
                <span style="font-size: 0.75rem; color: var(--gray-600); text-transform: capitalize;">${entry.mood}</span>
                ${entry.isDraft ? '<span style="padding: 0.125rem 0.5rem; background: rgba(249, 115, 22, 0.1); color: #ea580c; border-radius: 0.5rem; font-size: 0.75rem;">Draft</span>' : ''}
            </div>
        </div>
        ${entry.title !== 'Untitled Entry' ? `<h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800); font-size: 1rem;">${entry.title}</h4>` : ''}
        <div class="entry-preview" style="color: var(--gray-700); line-height: 1.5; margin-bottom: 0.75rem; font-size: 0.875rem;">${preview}</div>
        <div style="color: var(--gray-500); font-size: 0.75rem;">${entry.wordCount} words</div>
    `;
    
    // Add hover effects
    entryDiv.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
    
    entryDiv.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-sm)';
    });
    
    // Add click to view/edit functionality
    entryDiv.addEventListener('click', function() {
        viewEntryModal(entry);
    });
    
    return entryDiv;
}

// Get mood color helper function
function getMoodColor(mood) {
    const moodColors = {
        happy: '#10B981',
        excited: '#F59E0B',
        calm: '#3B82F6',
        neutral: '#6B7280',
        sad: '#EF4444',
        anxious: '#F59E0B',
        stressed: '#DC2626'
    };
    return moodColors[mood] || '#6B7280';
}

// View entry modal
function viewEntryModal(entry) {
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
                        <h2 style="margin: 0;">${entry.title}</h2>
                        <p style="margin: 0.5rem 0 0 0; color: var(--gray-600); font-size: 0.875rem;">${entry.formattedDate || entry.date}</p>
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
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <div style="background-color: ${getMoodColor(entry.mood)}; width: 12px; height: 12px; border-radius: 50%;"></div>
                        <span style="text-transform: capitalize; color: var(--gray-700);">Mood: ${entry.mood}</span>
                        ${entry.isDraft ? '<span style="padding: 0.25rem 0.75rem; background: rgba(249, 115, 22, 0.1); color: #ea580c; border-radius: 1rem; font-size: 0.75rem;">Draft</span>' : ''}
                    </div>
                </div>
                
                <div style="
                    color: var(--gray-700);
                    line-height: 1.6;
                    white-space: pre-wrap;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: var(--gray-50);
                    border-radius: 0.75rem;
                ">${entry.content}</div>
                
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

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        opacity: 0;
        transform: translateY(-100%);
        transition: all 0.3s ease;
        max-width: 300px;
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
    
    // Add save entry button functionality
    const saveButton = document.querySelector('#saveEntry');
    const saveAsDraftButton = document.querySelector('#saveAsDraft');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveJournalEntry(false);
        });
    }
    
    if (saveAsDraftButton) {
        saveAsDraftButton.addEventListener('click', function() {
            saveJournalEntry(true);
        });
    }
}
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

// Add some encouraging messages for empty states
function showEncouragingMessage() {
    const messages = [
        "Every thought matters. Start with just one sentence.",
        "Your feelings are valid. Let them flow onto the page.",
        "There's no wrong way to journal. Just be yourself.",
        "Take a deep breath and let your thoughts guide you.",
        "What's one thing that happened today?"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const textarea = document.querySelector('#journalContent');
    
    if (textarea && !textarea.value.trim()) {
        textarea.placeholder = randomMessage;
    }
}

// Show encouraging message after a few seconds if no input
setTimeout(showEncouragingMessage, 5000);

console.log('Journal functionality initialized ✍️');