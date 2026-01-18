// Worker Dashboard JavaScript

// Worker profile data
let currentWorkerProfile = null;
let isAvailable = true;

// Load worker profile
function loadWorkerProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!user.id) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Find worker profile
    const workers = LocalStorageDB.workers.get();
    const workerProfile = workers.find(w => w.userId === user.id);
    
    if (workerProfile) {
        currentWorkerProfile = workerProfile;
        displayProfile(workerProfile);
        
        // Update stats based on profile
        updateStats(workerProfile);
    } else {
        // No profile found, redirect to registration
        window.location.href = '../forms/worker-registration.html';
    }
}

// Display profile
function displayProfile(worker) {
    const container = document.getElementById('profileDetails');
    
    // Get profession details
    const professions = LocalStorageDB.professions.get();
    const professionData = professions.find(p => p.name.toLowerCase() === worker.profession);
    const professionName = professionData ? 
        `${professionData.icon} ${professionData.name} (${professionData.hindiName})` : 
        worker.profession;
    
    const html = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Basic Info Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Name</div>
                    <div style="font-weight: 600; color: var(--text-dark);">${worker.fullName}</div>
                </div>
                <div>
                    <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Father's Name</div>
                    <div style="font-weight: 600; color: var(--text-dark);">${worker.fatherName || 'Not specified'}</div>
                </div>
            </div>
            
            <!-- Contact Info Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Mobile</div>
                    <div style="font-weight: 600; color: var(--text-dark);">${worker.mobile}</div>
                </div>
                <div>
                    <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Age</div>
                    <div style="font-weight: 600; color: var(--text-dark);">${worker.age || 'Not specified'}</div>
                </div>
            </div>
            
            <!-- Profession Info -->
            <div>
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Profession</div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">${professionData ? professionData.icon : '👷'}</span>
                    <span style="font-weight: 600; color: var(--text-dark);">${professionName}</span>
                </div>
            </div>
            
            <!-- Experience & Rate -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Experience</div>
                    <div style="font-weight: 600; color: var(--text-dark);">${worker.experience || 'Not specified'}</div>
                </div>
                <div>
                    <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Daily Rate</div>
                    <div style="font-weight: 600; color: var(--success);">${worker.dailyRate || 'Not specified'}</div>
                </div>
            </div>
            
            <!-- Address -->
            <div>
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Address</div>
                <div style="font-weight: 600; color: var(--text-dark);">
                    ${worker.address || 'Not specified'}
                </div>
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-top: 0.25rem;">
                    ${worker.area} - ${worker.pincode || ''}
                </div>
            </div>
            
            <!-- Skills -->
            ${worker.skills && worker.skills.length > 0 ? `
            <div>
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.5rem;">Skills</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${worker.skills.map(skill => `
                        <span style="padding: 0.25rem 0.75rem; background: var(--bg-light); color: var(--text-dark); border-radius: 2rem; font-size: 0.875rem;">
                            ${skill}
                        </span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Verification Status -->
            <div style="padding: 1rem; background: ${worker.isVerified ? '#d1fae5' : '#fef3c7'}; border-radius: var(--radius);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <i class="fas fa-${worker.isVerified ? 'badge-check' : 'user-clock'}" 
                       style="color: ${worker.isVerified ? '#065f46' : '#92400e'};"></i>
                    <span style="font-weight: 600; color: ${worker.isVerified ? '#065f46' : '#92400e'};">
                        ${worker.isVerified ? 'Verified Worker' : 'Pending Verification'}
                    </span>
                </div>
                <p style="color: ${worker.isVerified ? '#065f46' : '#92400e'}; font-size: 0.875rem; margin: 0;">
                    ${worker.isVerified ? 
                        'Your profile is verified and appears in search results' :
                        'Your profile is under verification. It may take 24-48 hours.'}
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Update profile status
    const statusElement = document.getElementById('profileStatus');
    if (worker.isVerified) {
        statusElement.textContent = 'Verified';
        statusElement.style.backgroundColor = '#d1fae5';
        statusElement.style.color = '#065f46';
    } else {
        statusElement.textContent = 'Pending';
        statusElement.style.backgroundColor = '#fef3c7';
        statusElement.style.color = '#92400e';
    }
}

// Update stats
function updateStats(worker) {
    // Simulate random stats for demo
    const profileViews = Math.floor(Math.random() * 50) + 10;
    const contactCount = Math.floor(Math.random() * 20) + 5;
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    
    document.getElementById('profileViews').textContent = profileViews;
    document.getElementById('contactCount').textContent = contactCount;
    document.getElementById('ratingScore').textContent = rating;
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        {
            icon: 'fa-eye',
            title: 'Profile Viewed',
            description: 'Your profile was viewed by a customer',
            time: '2 hours ago',
            color: 'var(--primary)'
        },
        {
            icon: 'fa-phone',
            title: 'Contact Request',
            description: 'Customer showed interest in your profile',
            time: '1 day ago',
            color: 'var(--success)'
        },
        {
            icon: 'fa-star',
            title: 'Rating Updated',
            description: 'You received a new 5-star rating',
            time: '2 days ago',
            color: 'var(--warning)'
        },
        {
            icon: 'fa-map-marker-alt',
            title: 'Location Updated',
            description: 'Your working area was updated',
            time: '3 days ago',
            color: 'var(--info)'
        }
    ];
    
    const container = document.getElementById('recentActivity');
    let html = '';
    
    activities.forEach(activity => {
        html += `
            <div class="activity-item" style="padding: 1rem; border-bottom: 1px solid var(--border);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 40px; height: 40px; background: ${activity.color}20; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${activity.icon}" style="color: ${activity.color};"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-dark);">
                            ${activity.title}
                        </div>
                        <div style="color: var(--text-gray); font-size: 0.875rem;">
                            ${activity.description}
                        </div>
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.875rem;">
                        ${activity.time}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Edit profile
function editProfile() {
    if (!currentWorkerProfile) return;
    
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editProfileForm');
    
    // Get professions for dropdown
    const professions = LocalStorageDB.professions.get();
    
    // Create edit form
    form.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Basic Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="editFullName" class="form-control" 
                           value="${currentWorkerProfile.fullName || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Father's Name</label>
                    <input type="text" id="editFatherName" class="form-control" 
                           value="${currentWorkerProfile.fatherName || ''}">
                </div>
            </div>
            
            <!-- Contact Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Mobile</label>
                    <input type="tel" id="editMobile" class="form-control" 
                           value="${currentWorkerProfile.mobile || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Age</label>
                    <input type="number" id="editAge" class="form-control" 
                           value="${currentWorkerProfile.age || ''}" min="18" max="70">
                </div>
            </div>
            
            <!-- Profession -->
            <div class="form-group">
                <label class="form-label">Profession</label>
                <select id="editProfession" class="form-control form-select" required>
                    <option value="">Select Profession</option>
                    ${professions.map(prof => `
                        <option value="${prof.name.toLowerCase()}" 
                                ${currentWorkerProfile.profession === prof.name.toLowerCase() ? 'selected' : ''}>
                            ${prof.icon} ${prof.name} - ${prof.hindiName}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <!-- Experience & Rate -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Experience</label>
                    <select id="editExperience" class="form-control form-select">
                        <option value="">Select Experience</option>
                        <option value="Fresher" ${currentWorkerProfile.experience === 'Fresher' ? 'selected' : ''}>Fresher</option>
                        <option value="1-3 years" ${currentWorkerProfile.experience === '1-3 years' ? 'selected' : ''}>1-3 years</option>
                        <option value="3-5 years" ${currentWorkerProfile.experience === '3-5 years' ? 'selected' : ''}>3-5 years</option>
                        <option value="5+ years" ${currentWorkerProfile.experience === '5+ years' ? 'selected' : ''}>5+ years</option>
                        <option value="10+ years" ${currentWorkerProfile.experience === '10+ years' ? 'selected' : ''}>10+ years</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Daily Rate (₹)</label>
                    <input type="text" id="editDailyRate" class="form-control" 
                           value="${currentWorkerProfile.dailyRate || ''}" 
                           placeholder="e.g., ₹800-₹1000">
                </div>
            </div>
            
            <!-- Address -->
            <div class="form-group">
                <label class="form-label">Full Address</label>
                <textarea id="editAddress" class="form-control form-textarea" rows="3">${currentWorkerProfile.address || ''}</textarea>
            </div>
            
            <!-- Area & Pincode -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Area / Location</label>
                    <input type="text" id="editArea" class="form-control" 
                           value="${currentWorkerProfile.area || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Pincode</label>
                    <input type="text" id="editPincode" class="form-control" 
                           value="${currentWorkerProfile.pincode || ''}">
                </div>
            </div>
            
            <!-- Skills -->
            <div class="form-group">
                <label class="form-label">Skills (comma separated)</label>
                <input type="text" id="editSkills" class="form-control" 
                       value="${currentWorkerProfile.skills ? currentWorkerProfile.skills.join(', ') : ''}"
                       placeholder="e.g., wiring, fitting, repair">
            </div>
            
            <!-- Additional Info -->
            <div class="form-group">
                <label class="form-label">Additional Information</label>
                <textarea id="editAdditionalInfo" class="form-control form-textarea" rows="2"
                          placeholder="Any additional details about your work">${currentWorkerProfile.additionalInfo || ''}</textarea>
            </div>
        </div>
    `;
    
    // Add form submit handler
    form.onsubmit = handleProfileUpdate;
    
    // Show modal
    modal.style.display = 'flex';
}

// Handle profile update
function handleProfileUpdate(event) {
    event.preventDefault();
    
    if (!currentWorkerProfile) return;
    
    // Get updated values
    const updatedProfile = {
        ...currentWorkerProfile,
        fullName: document.getElementById('editFullName').value,
        fatherName: document.getElementById('editFatherName').value,
        mobile: document.getElementById('editMobile').value,
        age: document.getElementById('editAge').value,
        profession: document.getElementById('editProfession').value,
        experience: document.getElementById('editExperience').value,
        dailyRate: document.getElementById('editDailyRate').value,
        address: document.getElementById('editAddress').value,
        area: document.getElementById('editArea').value,
        pincode: document.getElementById('editPincode').value,
        skills: document.getElementById('editSkills').value
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0),
        additionalInfo: document.getElementById('editAdditionalInfo').value,
        updatedAt: new Date().toISOString()
    };
    
    // Update in database
    updateWorkerProfile(updatedProfile);
}

// Update worker profile in database
function updateWorkerProfile(updatedProfile) {
    try {
        // Get all workers
        const workers = LocalStorageDB.workers.get();
        
        // Find and update worker
        const index = workers.findIndex(w => w.id === updatedProfile.id);
        if (index !== -1) {
            workers[index] = updatedProfile;
            LocalStorageDB.workers.set(workers);
            
            // Update current profile
            currentWorkerProfile = updatedProfile;
            
            // Update display
            displayProfile(updatedProfile);
            
            // Close modal
            closeEditModal();
            
            // Show success message
            showNotification('Profile updated successfully!', 'success');
            
            // Add activity
            addActivity('Profile Updated', 'You updated your profile information');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile. Please try again.', 'error');
    }
}

// Update availability
function updateAvailability() {
    isAvailable = !isAvailable;
    const button = document.getElementById('availabilityBtn');
    
    if (isAvailable) {
        button.innerHTML = '<i class="fas fa-toggle-on"></i> Available';
        button.className = 'btn btn-outline';
        showNotification('You are now available for work', 'success');
    } else {
        button.innerHTML = '<i class="fas fa-toggle-off"></i> Not Available';
        button.className = 'btn btn-outline';
        button.style.color = 'var(--danger)';
        button.style.borderColor = 'var(--danger)';
        showNotification('You are now marked as not available', 'warning');
    }
}

// Add activity
function addActivity(title, description) {
    const activities = [
        {
            icon: 'fa-edit',
            title: title,
            description: description,
            time: 'Just now',
            color: 'var(--primary)'
        }
    ];
    
    // Prepend to existing activities
    const container = document.getElementById('recentActivity');
    const firstActivity = container.querySelector('.activity-item');
    
    if (firstActivity) {
        const activityHTML = `
            <div class="activity-item" style="padding: 1rem; border-bottom: 1px solid var(--border);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 40px; height: 40px; background: var(--primary)20; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-edit" style="color: var(--primary);"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-dark);">
                            ${title}
                        </div>
                        <div style="color: var(--text-gray); font-size: 0.875rem;">
                            ${description}
                        </div>
                    </div>
                    <div style="color: var(--text-gray); font-size: 0.875rem;">
                        Just now
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', activityHTML);
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type}`;
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id || user.role !== 'worker') {
        window.location.href = '../auth/login.html';
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
});