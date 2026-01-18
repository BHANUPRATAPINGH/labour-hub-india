// Login JavaScript File

// Create demo users if they don't exist
function createDemoUsers() {
    const users = LocalStorageDB.users.get();
    
    // Demo customer
    if (!users.find(u => u.mobile === '9876543210')) {
        LocalStorageDB.users.add({
            id: 'demo_customer_001',
            fullName: 'Rajesh Sharma',
            mobile: '9876543210',
            email: 'customer@labourhub.in',
            password: 'password123',
            role: 'customer',
            location: 'Delhi',
            createdAt: new Date().toISOString(),
            isActive: true,
            profileComplete: true
        });
    }
    
    // Demo worker
    if (!users.find(u => u.mobile === '9876543211')) {
        LocalStorageDB.users.add({
            id: 'demo_worker_001',
            fullName: 'Mohan Kumar',
            mobile: '9876543211',
            email: 'worker@labourhub.in',
            password: 'password123',
            role: 'worker',
            location: 'Delhi',
            createdAt: new Date().toISOString(),
            isActive: true,
            profileComplete: true
        });
        
        // Add demo worker profile
        const workers = LocalStorageDB.workers.get();
        if (!workers.find(w => w.mobile === '9876543211')) {
            LocalStorageDB.workers.add({
                id: 'worker_demo_001',
                userId: 'demo_worker_001',
                fullName: 'Mohan Kumar',
                mobile: '9876543211',
                fatherName: 'Ramesh Kumar',
                age: 28,
                address: '123, Patel Nagar, Delhi',
                area: 'Patel Nagar',
                pincode: '110008',
                profession: 'electrician',
                experience: '5 years',
                dailyRate: '₹800 - ₹1000',
                skills: ['Wiring', 'Fitting', 'Repair'],
                isVerified: true,
                createdAt: new Date().toISOString()
            });
        }
    }
    
    // Demo professional
    if (!users.find(u => u.mobile === '9876543212')) {
        LocalStorageDB.users.add({
            id: 'demo_professional_001',
            fullName: 'Construction Solutions',
            mobile: '9876543212',
            email: 'professional@labourhub.in',
            password: 'password123',
            role: 'professional',
            location: 'Mumbai',
            createdAt: new Date().toISOString(),
            isActive: true,
            profileComplete: true
        });
    }
}

// Login with mobile
function loginWithMobile(event) {
    event.preventDefault();
    
    const mobile = document.getElementById('loginMobile').value.trim();
    const password = document.getElementById('mobilePassword').value;
    
    if (!mobile || !password) {
        showAlert('Please enter mobile and password', 'error');
        return;
    }
    
    // Find user
    const users = LocalStorageDB.users.get();
    const user = users.find(u => u.mobile === mobile && u.password === password);
    
    if (user) {
        loginSuccess(user);
    } else {
        showAlert('Invalid mobile number or password', 'error');
    }
}

// Login with email
function loginWithEmail(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('emailPassword').value;
    
    if (!email || !password) {
        showAlert('Please enter email and password', 'error');
        return;
    }
    
    // Find user
    const users = LocalStorageDB.users.get();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        loginSuccess(user);
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

// Handle successful login
function loginSuccess(user) {
    // Save session
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Show success message
    showAlert(`Welcome back, ${user.fullName}! Redirecting...`, 'success');
    
    // Redirect based on role
    setTimeout(() => {
        switch(user.role) {
            case 'worker':
                // Check if worker profile exists
                const workers = LocalStorageDB.workers.get();
                const workerProfile = workers.find(w => w.userId === user.id);
                
                if (workerProfile) {
                    window.location.href = '../dashboard/worker.html';
                } else {
                    window.location.href = '../forms/worker-registration.html';
                }
                break;
                
            case 'professional':
                window.location.href = '../dashboard/professional.html';
                break;
                
            case 'customer':
            default:
                window.location.href = '../dashboard/customer.html';
                break;
        }
    }, 1500);
}

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (isLoggedIn === 'true' && currentUser.id) {
        // Already logged in, redirect to dashboard
        switch(currentUser.role) {
            case 'worker':
                window.location.href = '../dashboard/worker.html';
                break;
            case 'professional':
                window.location.href = '../dashboard/professional.html';
                break;
            case 'customer':
                window.location.href = '../dashboard/customer.html';
                break;
        }
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
    
    // Add to form container
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(alertDiv, formContainer.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Create demo users on first load
    createDemoUsers();
});