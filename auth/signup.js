// Signup JavaScript File

// Handle Signup Form Submission
function handleSignup(event) {
    event.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const location = document.getElementById('location').value;
    const role = document.getElementById('selectedRole').value;
    
    // Validation
    if (!role) {
        showAlert('Please select a role (Worker, Customer, or Professional)', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Check if mobile is 10 digits
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
        showAlert('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    // Create user object
    const user = {
        id: generateUserId(),
        fullName: fullName,
        mobile: mobile,
        email: email || `${mobile}@labourhub.in`,
        password: password, // In real app, hash this!
        role: role,
        location: location,
        createdAt: new Date().toISOString(),
        isActive: true,
        profileComplete: false
    };
    
    // Save user to database
    saveUser(user);
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save user to database
function saveUser(user) {
    try {
        // Get existing users
        const users = LocalStorageDB.users.get();
        
        // Check if mobile already exists
        const existingUser = users.find(u => u.mobile === user.mobile);
        if (existingUser) {
            showAlert('Mobile number already registered. Please login.', 'error');
            return;
        }
        
        // Add new user
        LocalStorageDB.users.add(user);
        
        // Save current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Show success message
        showAlert('Account created successfully! Redirecting...', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            redirectBasedOnRole(user.role, user.id);
        }, 1500);
        
    } catch (error) {
        console.error('Error saving user:', error);
        showAlert('Error creating account. Please try again.', 'error');
    }
}

// Redirect based on user role
function redirectBasedOnRole(role, userId) {
    switch(role) {
        case 'worker':
            // If worker, redirect to complete profile
            window.location.href = `../forms/worker-registration.html?userId=${userId}`;
            break;
            
        case 'professional':
            // If professional, redirect to professional dashboard
            window.location.href = `../dashboard/professional.html`;
            break;
            
        case 'customer':
            // If customer, redirect to customer dashboard
            window.location.href = `../dashboard/customer.html`;
            break;
            
        default:
            window.location.href = `../dashboard/customer.html`;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to form
    const form = document.getElementById('signupForm');
    form.insertBefore(alertDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (isLoggedIn === 'true' && currentUser.id) {
        // Redirect based on role
        redirectBasedOnRole(currentUser.role, currentUser.id);
    }
    
    // Add form validation
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('input', function(event) {
            // Real-time validation can be added here
        });
    }
});

// Export for testing
window.handleSignup = handleSignup;
window.showAlert = showAlert;