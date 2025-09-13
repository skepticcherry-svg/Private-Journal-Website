// Home page JavaScript - My Private Journal

document.addEventListener('DOMContentLoaded', function() {
    console.log('My Private Journal - Home page loaded');
    
    // Animate hero background circles
    animateBackgroundCircles();
    
    // Add subtle hover effects to feature cards
    addFeatureCardEffects();
    
    // Animate dots on scroll
    animateDotsOnScroll();
    
    // Initialize navigation
    initializeNavigation();
});

// Animate the background circles in the hero section
function animateBackgroundCircles() {
    const circles = document.querySelectorAll('.hero-bg-circle');
    
    circles.forEach((circle, index) => {
        // Add subtle floating animation
        const delay = index * 0.5;
        const duration = 3 + (index * 0.5);
        
        circle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        // Create floating keyframes
        if (!document.querySelector('#floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.6; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add pulse animation
        circle.style.animation += `, pulse ${duration * 1.5}s ease-in-out ${delay}s infinite`;
    });
}

// Add interactive effects to feature cards
function addFeatureCardEffects() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.05) rotate(0deg)';
            }
        });
        
        // Add staggered animation on load
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
        
        // Initially hide for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
    });
}

// Animate decorative dots based on scroll position
function animateDotsOnScroll() {
    const heroDots = document.querySelectorAll('.hero-dot');
    const footerDots = document.querySelectorAll('.footer-dot');
    
    window.addEventListener('scroll', function() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Animate hero dots
        heroDots.forEach((dot, index) => {
            const rotation = scrollPercent * 360 * (index + 1);
            const scale = 1 + (Math.sin(scrollPercent * Math.PI * 4 + index) * 0.2);
            dot.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        });
        
        // Animate footer dots
        footerDots.forEach((dot, index) => {
            const rotation = scrollPercent * -180 * (index + 1);
            dot.style.transform = `rotate(${rotation}deg)`;
        });
    });
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
        
        // Add hover effect for navigation links
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = 'rgba(249, 250, 251, 0.8)';
                this.style.transform = 'translateY(-1px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = 'transparent';
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Add ripple keyframes
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
}

// Add smooth scrolling for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll('.journal-entry, .features-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});

// Add a subtle parallax effect to the hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroBackground = document.querySelector('.hero-bg');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Console welcome message
console.log(`
🌟 Welcome to My Private Journal! 
✨ A safe space for your thoughts and emotions
🔒 Your privacy is our priority
`);