// Main JavaScript File - Home Page

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load professions on home page
    loadProfessionsOnHome();
    
    // Check login status
    checkLoginStatus();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Add animation on scroll
    initScrollAnimations();
});

// Load professions on home page
function loadProfessionsOnHome() {
    const professionsContainer = document.getElementById('professionsList');
    
    if (!professionsContainer) return;
    
    const professions = LocalStorageDB.professions.get();
    
    let html = '';
    professions.forEach(profession => {
        html += `
            <div class="profession-card" onclick="navigateToSearch('${profession.name.toLowerCase()}')">
                <div class="profession-icon">
                    ${profession.icon}
                </div>
                <h3>${profession.name}</h3>
                <p>${profession.hindiName}</p>
                <div class="worker-count">
                    <i class="fas fa-users"></i> ${profession.workers || 0}+ workers
                </div>
            </div>
        `;
    });
    
    professionsContainer.innerHTML = html;
}

// Navigate to search with profession
function navigateToSearch(profession) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (user.id && user.role === 'customer') {
        // If customer, go to customer dashboard with profession filter
        window.location.href = `dashboard/customer.html?profession=${profession}`;
    } else if (user.id && user.role === 'worker') {
        // If worker, go to worker dashboard
        window.location.href = 'dashboard/worker.html';
    } else {
        // If not logged in or not customer, go to signup
        window.location.href = `auth/signup.html?role=customer&profession=${profession}`;
    }
}

// Check login status
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (!navButtons) return;
    
    if (user.id) {
        // User is logged in
        const userName = user.fullName || 'User';
        const userRole = user.role || 'customer';
        
        // Update nav buttons based on role
        let dashboardLink = '';
        switch(userRole) {
            case 'worker':
                dashboardLink = 'dashboard/worker.html';
                break;
            case 'professional':
                dashboardLink = 'dashboard/professional.html';
                break;
            case 'customer':
            default:
                dashboardLink = 'dashboard/customer.html';
                break;
        }
        
        navButtons.innerHTML = `
            <a href="${dashboardLink}" class="btn btn-outline">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <button onclick="logout()" class="btn btn-primary">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
    } else {
        // User is not logged in
        navButtons.innerHTML = `
            <a href="auth/login.html" class="btn btn-outline">Login</a>
            <a href="auth/signup.html" class="btn btn-primary">Sign Up Free</a>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = 'index.html';
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            if (navLinks.style.display === 'flex') {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                navLinks.style.zIndex = '1000';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.style.display = 'none';
            }
        });
    }
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.step-card, .profession-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .step-card, .profession-card {
            opacity: 0;
        }
        
        .step-card.animate-in, .profession-card.animate-in {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Demo function for quick search chips
function quickSearch(profession) {
    navigateToSearch(profession.toLowerCase());
}

// Initialize testimonials (if any)
function loadTestimonials() {
    // This can be expanded to load testimonials from database
    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "Homeowner",
            text: "Found a great electrician within 10 minutes! LabourHub saved my day.",
            rating: 5
        },
        {
            name: "Sunita Sharma",
            role: "Restaurant Owner",
            text: "Regularly hire cleaners through LabourHub. Very reliable service.",
            rating: 4
        },
        {
            name: "Mohan Singh",
            role: "Worker",
            text: "Got consistent work in my area. Income has increased by 40%.",
            rating: 5
        }
    ];
    
    // If there's a testimonials section, populate it
    const testimonialsContainer = document.getElementById('testimonialsList');
    if (testimonialsContainer) {
        let html = '';
        testimonials.forEach(testimonial => {
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < testimonial.rating ? 
                    '<i class="fas fa-star" style="color: #fbbf24;"></i>' : 
                    '<i class="far fa-star" style="color: #d1d5db;"></i>';
            }
            
            html += `
                <div class="testimonial-card">
                    <div class="testimonial-text">"${testimonial.text}"</div>
                    <div class="testimonial-rating">${stars}</div>
                    <div class="testimonial-author">
                        <strong>${testimonial.name}</strong>
                        <span>${testimonial.role}</span>
                    </div>
                </div>
            `;
        });
        
        testimonialsContainer.innerHTML = html;
    }
}

// Add CSS for testimonials if needed
function addTestimonialStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .testimonials-section {
            padding: 5rem 1rem;
            background: var(--bg-white);
        }
        
        .testimonials-grid {
            display: grid;
            gap: 2rem;
        }
        
        @media (min-width: 768px) {
            .testimonials-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        
        .testimonial-card {
            background: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow);
        }
        
        .testimonial-text {
            font-size: 1.125rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .testimonial-rating {
            margin-bottom: 1rem;
        }
        
        .testimonial-author {
            display: flex;
            flex-direction: column;
        }
        
        .testimonial-author strong {
            color: var(--text-dark);
        }
        
        .testimonial-author span {
            color: var(--text-gray);
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(style);
}

// Call testimonial functions if needed
document.addEventListener('DOMContentLoaded', function() {
    // Check if testimonials section exists
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        addTestimonialStyles();
        loadTestimonials();
    }
});

// Helper function to show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.global-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `global-notification alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; margin-left: auto; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        max-width: 350px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Add animation CSS
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border-radius: var(--radius);
        margin-bottom: 1rem;
    }
    
    .alert-success {
        background-color: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }
    
    .alert-error {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
    }
    
    .alert-info {
        background-color: #dbeafe;
        color: #1e40af;
        border: 1px solid #bfdbfe;
    }
`;
document.head.appendChild(animationStyle);