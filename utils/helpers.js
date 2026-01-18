// Helper Functions - Common utilities for LabourHub

// Format Indian currency
function formatIndianCurrency(amount) {
    if (!amount) return '₹0';
    
    // Remove any non-numeric characters
    const num = parseInt(amount.toString().replace(/[^0-9]/g, ''));
    
    if (isNaN(num)) return '₹0';
    
    // Format with Indian numbering system
    const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(num);
    
    return '₹' + formatted;
}

// Format phone number
function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    const cleaned = phone.toString().replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0,5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length > 10) {
        return `+${cleaned.slice(0, cleaned.length - 10)} ${cleaned.slice(-10, -5)} ${cleaned.slice(-5)}`;
    }
    
    return phone;
}

// Get profession display name
function getProfessionDisplayName(professionKey) {
    const professions = LocalStorageDB.professions.get();
    const profession = professions.find(p => p.name.toLowerCase() === professionKey);
    
    if (profession) {
        return {
            name: profession.name,
            hindiName: profession.hindiName,
            icon: profession.icon,
            display: `${profession.icon} ${profession.name}`
        };
    }
    
    // Return default if not found
    return {
        name: professionKey,
        hindiName: professionKey,
        icon: '👷',
        display: professionKey.charAt(0).toUpperCase() + professionKey.slice(1)
    };
}

// Calculate age from date of birth
function calculateAge(dobString) {
    if (!dobString) return null;
    
    const dob = new Date(dobString);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate mobile number
function isValidMobile(mobile) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile.toString().replace(/\D/g, ''));
}

// Validate pincode
function isValidPincode(pincode) {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode.toString().replace(/\D/g, ''));
}

// Debounce function for search inputs
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

// Throttle function for scroll events
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
    };
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

// Check if user is authenticated
function isAuthenticated() {
    const user = getCurrentUser();
    return !!user.id && localStorage.getItem('isLoggedIn') === 'true';
}

// Check user role
function getUserRole() {
    const user = getCurrentUser();
    return user.role || null;
}

// Redirect if not authenticated
function requireAuth(role = null) {
    if (!isAuthenticated()) {
        window.location.href = '../auth/login.html';
        return false;
    }
    
    if (role && getUserRole() !== role) {
        window.location.href = '../dashboard/' + getUserRole() + '.html';
        return false;
    }
    
    return true;
}

// Generate random ID
function generateId(prefix = '') {
    return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Format date
function formatDate(dateString, format = 'medium') {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (format === 'short') {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } else if (format === 'time') {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Get time ago
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + ' years ago';
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' months ago';
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' days ago';
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hours ago';
    }
    
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minutes ago';
    }
    
    return 'Just now';
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 9999;
                animation: toastSlideIn 0.3s ease;
                max-width: 400px;
            }
            
            .toast-success {
                border-left: 4px solid var(--success);
            }
            
            .toast-error {
                border-left: 4px solid var(--danger);
            }
            
            .toast-info {
                border-left: 4px solid var(--primary);
            }
            
            .toast-warning {
                border-left: 4px solid var(--warning);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: var(--text-gray);
                cursor: pointer;
                padding: 0.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .toast-close:hover {
                color: var(--text-dark);
            }
            
            @keyframes toastSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Local storage wrapper with encryption (basic)
const Storage = {
    set: function(key, value) {
        try {
            // In production, encrypt sensitive data
            const encrypted = btoa(encodeURIComponent(JSON.stringify(value)));
            localStorage.setItem(key, encrypted);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            
            const decrypted = JSON.parse(decodeURIComponent(atob(encrypted)));
            return decrypted;
        } catch (error) {
            // Fallback to plain storage for demo
            const plain = localStorage.getItem(key);
            try {
                return plain ? JSON.parse(plain) : null;
            } catch {
                return plain;
            }
        }
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    },
    
    clear: function() {
        localStorage.clear();
    }
};

// Export all functions to global scope
window.Helpers = {
    formatIndianCurrency,
    formatPhoneNumber,
    getProfessionDisplayName,
    calculateAge,
    isValidEmail,
    isValidMobile,
    isValidPincode,
    debounce,
    throttle,
    getCurrentUser,
    isAuthenticated,
    getUserRole,
    requireAuth,
    generateId,
    formatDate,
    getTimeAgo,
    copyToClipboard,
    showToast,
    Storage
};

// Initialize default data if not exists
function initializeDefaultData() {
    // Check if default data already exists
    if (localStorage.getItem('labourhub_initialized')) {
        return;
    }
    
    // Initialize professions
    const defaultProfessions = [
        { id: '1', name: 'Electrician', hindiName: 'इलेक्ट्रीशियन', icon: '⚡', workers: 45 },
        { id: '2', name: 'Plumber', hindiName: 'प्लम्बर', icon: '🔧', workers: 38 },
        { id: '3', name: 'Mason', hindiName: 'राज मिस्त्री', icon: '🧱', workers: 52 },
        { id: '4', name: 'Painter', hindiName: 'पेंटर', icon: '🎨', workers: 28 },
        { id: '5', name: 'Carpenter', hindiName: 'बढ़ई', icon: '🔨', workers: 34 },
        { id: '6', name: 'Driver', hindiName: 'ड्राइवर', icon: '🚗', workers: 67 },
        { id: '7', name: 'Cleaner', hindiName: 'सफाई कर्मचारी', icon: '🧹', workers: 89 },
        { id: '8', name: 'Welder', hindiName: 'वेल्डर', icon: '🔥', workers: 23 },
        { id: '9', name: 'Mechanic', hindiName: 'मैकेनिक', icon: '🔩', workers: 41 },
        { id: '10', name: 'Cook', hindiName: 'रसोइया', icon: '👨‍🍳', workers: 56 },
        { id: '11', name: 'Gardener', hindiName: 'माली', icon: '🌿', workers: 19 },
        { id: '12', name: 'Security Guard', hindiName: 'सिक्योरिटी गार्ड', icon: '🛡️', workers: 72 }
    ];
    
    LocalStorageDB.professions.set(defaultProfessions);
    
    // Initialize areas
    const defaultAreas = [
        { id: '1', name: 'Delhi', workers: 150 },
        { id: '2', name: 'Mumbai', workers: 200 },
        { id: '3', name: 'Bangalore', workers: 180 },
        { id: '4', name: 'Chennai', workers: 120 },
        { id: '5', name: 'Kolkata', workers: 100 },
        { id: '6', name: 'Hyderabad', workers: 140 },
        { id: '7', name: 'Pune', workers: 90 },
        { id: '8', name: 'Ahmedabad', workers: 80 },
        { id: '9', name: 'Jaipur', workers: 60 },
        { id: '10', name: 'Lucknow', workers: 70 }
    ];
    
    LocalStorageDB.areas.set(defaultAreas);
    
    // Add some demo workers
    const demoWorkers = [
        {
            id: 'worker_demo_1',
            userId: 'demo_worker_001',
            fullName: 'Ramesh Kumar',
            fatherName: 'Suresh Kumar',
            mobile: '9876543211',
            age: 32,
            address: '123, Patel Nagar, Delhi',
            area: 'Patel Nagar',
            pincode: '110008',
            profession: 'electrician',
            experience: '5 years',
            dailyRate: '₹800-₹1000',
            skills: ['Wiring', 'Fitting', 'Repair', 'Installation'],
            isVerified: true,
            createdAt: '2024-01-15T10:30:00Z'
        },
        {
            id: 'worker_demo_2',
            userId: 'demo_worker_002',
            fullName: 'Suresh Patel',
            fatherName: 'Mahesh Patel',
            mobile: '9876543212',
            age: 28,
            address: '456, Andheri West, Mumbai',
            area: 'Andheri',
            pincode: '400053',
            profession: 'plumber',
            experience: '3 years',
            dailyRate: '₹700-₹900',
            skills: ['Pipe Fitting', 'Leak Repair', 'Installation'],
            isVerified: true,
            createdAt: '2024-01-20T14:45:00Z'
        },
        {
            id: 'worker_demo_3',
            userId: 'demo_worker_003',
            fullName: 'Rajesh Singh',
            fatherName: 'Vikram Singh',
            mobile: '9876543213',
            age: 45,
            address: '789, Koramangala, Bangalore',
            area: 'Koramangala',
            pincode: '560034',
            profession: 'mason',
            experience: '15 years',
            dailyRate: '₹1000-₹1200',
            skills: ['Construction', 'Tiling', 'Plastering'],
            isVerified: true,
            createdAt: '2024-01-25T09:15:00Z'
        }
    ];
    
    LocalStorageDB.workers.set(demoWorkers);
    
    // Mark as initialized
    localStorage.setItem('labourhub_initialized', 'true');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeDefaultData);