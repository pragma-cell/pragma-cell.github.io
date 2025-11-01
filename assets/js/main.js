// Pragma Cell Website JavaScript

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initScrollReveal();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Add active class to current section link
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll reveal animations
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should be revealed
    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });

    // Add scroll-reveal class to cards and sections
    const cards = document.querySelectorAll('.philosophy-card, .service-card, .team-card');
    const sections = document.querySelectorAll('.section-header, .hero-content, .contact-content');
    
    [...cards, ...sections].forEach((element, index) => {
        element.classList.add('scroll-reveal');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Simulate form submission
                showFormMessage('Merci ! Votre message a été envoyé avec succès. Nous vous recontacterons bientôt.', 'success');
                form.reset();
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    // Required fields
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères.');
        highlightField('name', true);
    } else {
        highlightField('name', false);
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Veuillez entrer une adresse email valide.');
        highlightField('email', true);
    } else {
        highlightField('email', false);
    }
    
    if (!data.subject) {
        errors.push('Veuillez sélectionner un sujet.');
        highlightField('subject', true);
    } else {
        highlightField('subject', false);
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères.');
        highlightField('message', true);
    } else {
        highlightField('message', false);
    }
    
    if (errors.length > 0) {
        showFormMessage(errors.join(' '), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Highlight form field
function highlightField(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    if (field) {
        if (hasError) {
            field.style.borderColor = 'var(--error-color)';
            field.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
        } else {
            field.style.borderColor = 'var(--success-color)';
            field.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        }, 3000);
    }
}

// Show form message
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.innerHTML = `
        <div class="form-message__content">
            <span class="form-message__icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="form-message__text">${message}</span>
        </div>
    `;
    
    // Add styles
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 16px 20px;
        border-radius: 8px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
        color: white;
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        font-size: 14px;
        line-height: 1.4;
    `;
    
    // Add animation styles
    if (!document.querySelector('#form-message-styles')) {
        const styles = document.createElement('style');
        styles.id = 'form-message-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .form-message__content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .form-message__icon {
                font-weight: bold;
                font-size: 16px;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to document
    document.body.appendChild(messageElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 5000);
}

// Scroll animations for stats
function initScrollAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Animate number counting
function animateNumber(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on target
        let displayValue = Math.floor(current);
        if (element.textContent.includes('+')) {
            displayValue = displayValue + '+';
        }
        if (element.textContent.includes('%')) {
            displayValue = displayValue + '%';
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Utility function to throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add CSS for better mobile menu behavior
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    body.menu-open {
        overflow: hidden;
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-sm);
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
`;

document.head.appendChild(additionalStyles);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
});

// Performance optimization: Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets/images/logo.svg',
        'assets/images/hero-illustration.svg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Export functions for potential external use
window.PragmaCell = {
    showMessage: showFormMessage,
    validateEmail: isValidEmail,
    animateNumber: animateNumber
};