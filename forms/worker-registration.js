// Worker Registration JavaScript

let currentStep = 1;
const totalSteps = 4;
let selectedProfession = '';

// Load professions
function loadProfessions() {
    const professions = LocalStorageDB.professions.get();
    const select = document.getElementById('profession');
    const grid = document.getElementById('professionGrid');
    
    // Clear existing options
    select.innerHTML = '<option value="">Select your profession - पेशा चुनें</option>';
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add to dropdown and grid
    professions.forEach(prof => {
        // Add to dropdown
        const option = document.createElement('option');
        option.value = prof.name.toLowerCase();
        option.textContent = `${prof.icon} ${prof.name} - ${prof.hindiName}`;
        select.appendChild(option);
        
        // Add to grid
        const card = document.createElement('div');
        card.className = 'profession-card';
        card.dataset.profession = prof.name.toLowerCase();
        card.innerHTML = `
            <div class="profession-icon">${prof.icon}</div>
            <div class="profession-name">${prof.name}</div>
            <div class="profession-hindi">${prof.hindiName}</div>
        `;
        
        card.addEventListener('click', function() {
            selectProfession(prof.name.toLowerCase());
        });
        
        grid.appendChild(card);
    });
}

// Select profession
function selectProfession(profession) {
    selectedProfession = profession;
    
    // Update dropdown
    document.getElementById('profession').value = profession;
    
    // Update card selection
    document.querySelectorAll('.profession-card').forEach(card => {
        if (card.dataset.profession === profession) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Navigation functions
function nextStep() {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to next step
    currentStep++;
    
    // Update progress
    updateProgress();
    
    // Show next step
    document.getElementById(`step${currentStep}`).style.display = 'block';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // If moving to review step, update review
    if (currentStep === 4) {
        updateReview();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function prevStep() {
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to previous step
    currentStep--;
    
    // Update progress
    updateProgress();
    
    // Show previous step
    document.getElementById(`step${currentStep}`).style.display = 'block';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function goToStep(stepNumber) {
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to specified step
    currentStep = stepNumber;
    
    // Update progress
    updateProgress();
    
    // Show specified step
    document.getElementById(`step${currentStep}`).style.display = 'block';
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Update progress bar
function updateProgress() {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressLine').style.width = `${progressPercentage}%`;
    
    // Update step status
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = parseInt(step.dataset.step);
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Validate step
function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

function validateStep1() {
    const requiredFields = [
        'fullName',
        'fatherName',
        'mobile',
        'age',
        'address',
        'area',
        'pincode'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Additional validations
            if (fieldId === 'mobile' && !/^[0-9]{10}$/.test(field.value)) {
                showFieldError(field, 'Please enter a valid 10-digit mobile number');
                isValid = false;
            }
            
            if (fieldId === 'pincode' && !/^[0-9]{6}$/.test(field.value)) {
                showFieldError(field, 'Please enter a valid 6-digit pincode');
                isValid = false;
            }
            
            if (fieldId === 'age') {
                const age = parseInt(field.value);
                if (age < 18 || age > 70) {
                    showFieldError(field, 'Age must be between 18 and 70');
                    isValid = false;
                }
            }
        }
    });
    
    return isValid;
}

function validateStep2() {
    const profession = document.getElementById('profession').value;
    
    if (!profession) {
        showFieldError(document.getElementById('profession'), 'Please select a profession');
        return false;
    }
    
    clearFieldError(document.getElementById('profession'));
    return true;
}

function validateStep3() {
    const experience = document.getElementById('experience').value;
    const dailyRate = document.getElementById('dailyRate').value;
    const skills = document.getElementById('skills').value;
    
    let isValid = true;
    
    if (!experience) {
        showFieldError(document.getElementById('experience'), 'Please select experience');
        isValid = false;
    } else {
        clearFieldError(document.getElementById('experience'));
    }
    
    if (!dailyRate) {
        showFieldError(document.getElementById('dailyRate'), 'Please enter expected daily rate');
        isValid = false;
    } else {
        clearFieldError(document.getElementById('dailyRate'));
    }
    
    if (!skills) {
        // Show error on skills tags container
        const skillsTags = document.getElementById('skillsTags');
        skillsTags.style.borderColor = 'var(--danger)';
        isValid = false;
    } else {
        document.getElementById('skillsTags').style.borderColor = '';
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--danger)';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Update review section
function updateReview() {
    // Basic info
    const basicInfo = `
        <p><strong>Name:</strong> ${document.getElementById('fullName').value}</p>
        <p><strong>Father's Name:</strong> ${document.getElementById('fatherName').value}</p>
        <p><strong>Mobile:</strong> ${document.getElementById('mobile').value}</p>
        <p><strong>Age:</strong> ${document.getElementById('age').value} years</p>
        <p><strong>Address:</strong> ${document.getElementById('address').value}</p>
        <p><strong>Area:</strong> ${document.getElementById('area').value}</p>
        <p><strong>Pincode:</strong> ${document.getElementById('pincode').value}</p>
    `;
    document.getElementById('reviewBasic').innerHTML = basicInfo;
    
    // Profession
    const professionValue = document.getElementById('profession').value;
    const professions = LocalStorageDB.professions.get();
    const professionData = professions.find(p => p.name.toLowerCase() === professionValue);
    const professionName = professionData ? 
        `${professionData.icon} ${professionData.name} (${professionData.hindiName})` : 
        professionValue;
    
    document.getElementById('reviewProfession').innerHTML = `
        <p><strong>Profession:</strong> ${professionName}</p>
        ${document.getElementById('otherProfession').value ? 
            `<p><strong>Other Profession:</strong> ${document.getElementById('otherProfession').value}</p>` : ''}
    `;
    
    // Experience & Skills
    const skillsTags = Array.from(document.querySelectorAll('.skill-tag span:first-child'))
        .map(span => span.textContent)
        .join(', ');
    
    const tools = Array.from(document.querySelectorAll('input[name="tools"]:checked'))
        .map(checkbox => checkbox.value)
        .join(', ');
    
    document.getElementById('reviewExperience').innerHTML = `
        <p><strong>Experience:</strong> ${document.getElementById('experience').value}</p>
        <p><strong>Daily Rate:</strong> ₹${document.getElementById('dailyRate').value}</p>
        <p><strong>Skills:</strong> ${skillsTags || 'No skills added'}</p>
        ${document.getElementById('previousWork').value ? 
            `<p><strong>Previous Work:</strong> ${document.getElementById('previousWork').value}</p>` : ''}
        ${tools ? `<p><strong>Tools Owned:</strong> ${tools}</p>` : ''}
    `;
}

// Submit registration
function submitRegistration() {
    // Validate final step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Check agreement checkboxes
    if (!document.getElementById('agreeTerms').checked || 
        !document.getElementById('consent').checked) {
        alert('Please agree to the terms and give consent to continue');
        return;
    }
    
    // Get user data
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Create worker profile
    const workerData = {
        id: 'worker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        fullName: document.getElementById('fullName').value,
        fatherName: document.getElementById('fatherName').value,
        mobile: document.getElementById('mobile').value,
        age: document.getElementById('age').value,
        address: document.getElementById('address').value,
        area: document.getElementById('area').value,
        pincode: document.getElementById('pincode').value,
        profession: document.getElementById('profession').value,
        experience: document.getElementById('experience').value,
        dailyRate: '₹' + document.getElementById('dailyRate').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
        previousWork: document.getElementById('previousWork').value || '',
        toolsOwned: Array.from(document.querySelectorAll('input[name="tools"]:checked'))
            .map(checkbox => checkbox.value),
        isVerified: false, // Will be verified by admin in future
        isActive: true,
        profileViews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save worker profile
    saveWorkerProfile(workerData);
}

// Save worker profile
function saveWorkerProfile(workerData) {
    try {
        // Check if profile already exists
        const workers = LocalStorageDB.workers.get();
        const existingProfileIndex = workers.findIndex(w => w.userId === workerData.userId);
        
        if (existingProfileIndex !== -1) {
            // Update existing profile
            workers[existingProfileIndex] = workerData;
        } else {
            // Add new profile
            workers.push(workerData);
        }
        
        // Save to database
        LocalStorageDB.workers.set(workers);
        
        // Update user profile complete status
        const users = LocalStorageDB.users.get();
        const userIndex = users.findIndex(u => u.id === workerData.userId);
        
        if (userIndex !== -1) {
            users[userIndex].profileComplete = true;
            users[userIndex].mobile = workerData.mobile; // Update mobile if changed
            LocalStorageDB.users.set(users);
            
            // Update current user in session
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        
        // Show success modal
        showSuccessModal();
        
    } catch (error) {
        console.error('Error saving worker profile:', error);
        alert('Error saving profile. Please try again.');
    }
}

// Show success modal
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    window.location.href = '../dashboard/worker.html';
}

// Initialize CSS for errors
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: var(--danger) !important;
        }
        
        .field-error {
            color: var(--danger);
            font-size: 0.75rem;
            margin-top: 0.25rem;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: white;
            border-radius: var(--radius-lg);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});