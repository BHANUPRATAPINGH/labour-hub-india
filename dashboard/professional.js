// Professional Dashboard JavaScript

// Current data
let currentProfessional = null;
let currentWorkers = [];
let currentViewingWorker = null;

// Load dashboard data
function loadDashboardData() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!user.id || user.role !== 'professional') {
        window.location.href = '../auth/login.html';
        return;
    }
    
    currentProfessional = user;
    
    // Load workers added by this professional
    loadWorkers();
    
    // Update stats
    updateStats();
}

// Load workers
function loadWorkers() {
    const workers = LocalStorageDB.workers.get();
    
    // Filter workers added by this professional
    currentWorkers = workers.filter(worker => worker.addedBy === currentProfessional.id);
    
    // Update UI
    updateWorkerList();
}

// Update stats
function updateStats() {
    document.getElementById('totalWorkers').textContent = currentWorkers.length;
    
    // Count active workers (simulated)
    const activeWorkers = currentWorkers.filter(w => w.isActive !== false).length;
    document.getElementById('activeWorkers').textContent = activeWorkers;
    
    // Simulate profile views
    const totalViews = currentWorkers.length * (Math.floor(Math.random() * 10) + 5);
    document.getElementById('profileViews').textContent = totalViews;
    
    // Future earnings calculation
    const freeWorkers = Math.min(currentWorkers.length, 10);
    const paidWorkers = Math.max(0, currentWorkers.length - 10);
    const futureEarnings = paidWorkers * 10; // ₹10 per worker after first 10
    document.getElementById('earnings').textContent = `₹${futureEarnings}`;
}

// Update worker list
function updateWorkerList() {
    const container = document.getElementById('recentWorkers');
    
    if (currentWorkers.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; color: var(--text-light); margin-bottom: 1rem;">
                    <i class="fas fa-users-slash"></i>
                </div>
                <p style="color: var(--text-gray); margin-bottom: 1.5rem;">
                    No workers added yet
                </p>
                <button onclick="addNewWorker()" class="btn btn-primary">
                    <i class="fas fa-user-plus"></i> Add Your First Worker
                </button>
            </div>
        `;
        return;
    }
    
    // Show recent workers (last 5)
    const recentWorkers = [...currentWorkers]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    let html = '<div style="display: grid; gap: 1rem;">';
    
    recentWorkers.forEach(worker => {
        // Get profession icon
        const professions = LocalStorageDB.professions.get();
        const professionData = professions.find(p => p.name.toLowerCase() === worker.profession);
        const professionIcon = professionData ? professionData.icon : '👷';
        
        html += `
            <div class="worker-item card" style="cursor: pointer; padding: 1rem;" 
                 onclick="viewWorker('${worker.id}')">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 1.5rem; color: var(--primary);">
                        ${professionIcon}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem;">
                            ${worker.fullName}
                        </div>
                        <div style="display: flex; gap: 1rem; font-size: 0.875rem;">
                            <span style="color: var(--text-gray);">
                                <i class="fas fa-briefcase"></i> ${worker.profession}
                            </span>
                            <span style="color: var(--text-gray);">
                                <i class="fas fa-map-marker-alt"></i> ${worker.area}
                            </span>
                        </div>
                    </div>
                    <div>
                        <span style="padding: 0.25rem 0.75rem; background: ${worker.isVerified ? '#d1fae5' : '#fef3c7'}; color: ${worker.isVerified ? '#065f46' : '#92400e'}; border-radius: 2rem; font-size: 0.75rem;">
                            ${worker.isVerified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Add new worker
function addNewWorker() {
    // Check free worker limit
    if (currentWorkers.length >= 10) {
        showNotification('You have reached the free limit of 10 workers. In future version, you can add more workers for ₹10 each.', 'warning');
        return;
    }
    
    const modal = document.getElementById('addWorkerModal');
    const form = document.getElementById('addWorkerForm');
    
    // Get professions for dropdown
    const professions = LocalStorageDB.professions.get();
    
    // Create form
    form.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Basic Info -->
            <div class="form-group">
                <label class="form-label">Worker's Full Name *</label>
                <input type="text" id="workerFullName" class="form-control" 
                       placeholder="Enter worker's full name" required>
            </div>
            
            <!-- Contact Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Mobile Number *</label>
                    <input type="tel" id="workerMobile" class="form-control" 
                           placeholder="9876543210" required
                           pattern="[0-9]{10}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Father's Name</label>
                    <input type="text" id="workerFatherName" class="form-control" 
                           placeholder="Worker's father name">
                </div>
            </div>
            
            <!-- Age & Profession -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Age</label>
                    <input type="number" id="workerAge" class="form-control" 
                           placeholder="25" min="18" max="70">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Profession *</label>
                    <select id="workerProfession" class="form-control form-select" required>
                        <option value="">Select Profession</option>
                        ${professions.map(prof => `
                            <option value="${prof.name.toLowerCase()}">
                                ${prof.icon} ${prof.name} - ${prof.hindiName}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
            
            <!-- Experience & Rate -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Experience</label>
                    <select id="workerExperience" class="form-control form-select">
                        <option value="">Select Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                        <option value="10+ years">10+ years</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Daily Rate (₹)</label>
                    <input type="text" id="workerDailyRate" class="form-control" 
                           placeholder="e.g., ₹800-₹1000">
                </div>
            </div>
            
            <!-- Address -->
            <div class="form-group">
                <label class="form-label">Full Address *</label>
                <textarea id="workerAddress" class="form-control form-textarea" rows="3"
                          placeholder="House no, Street, City, State" required></textarea>
            </div>
            
            <!-- Area & Pincode -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Area / Location *</label>
                    <input type="text" id="workerArea" class="form-control" 
                           placeholder="e.g., Patel Nagar" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Pincode</label>
                    <input type="text" id="workerPincode" class="form-control" 
                           placeholder="110008">
                </div>
            </div>
            
            <!-- Skills -->
            <div class="form-group">
                <label class="form-label">Skills (comma separated)</label>
                <input type="text" id="workerSkills" class="form-control" 
                       placeholder="e.g., wiring, fitting, repair">
            </div>
            
            <!-- Verification -->
            <div class="form-check">
                <input type="checkbox" id="workerVerified" class="form-check-input">
                <label for="workerVerified" class="form-check-label">
                    Mark as Verified Worker
                </label>
                <small style="display: block; color: var(--text-gray); font-size: 0.75rem;">
                    Verified workers appear more trustworthy to customers
                </small>
            </div>
            
            <!-- Plan Info -->
            <div style="padding: 1rem; background: #f0f9ff; border-radius: var(--radius);">
                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--primary); margin-bottom: 0.5rem;">
                    <i class="fas fa-info-circle"></i>
                    <span style="font-weight: 600;">Current Plan: FREE</span>
                </div>
                <p style="color: var(--text-gray); font-size: 0.875rem; margin: 0;">
                    Workers added: ${currentWorkers.length}/10 (Free)<br>
                    You can add ${10 - currentWorkers.length} more workers for free.
                </p>
            </div>
        </div>
    `;
    
    // Add form submit handler
    form.onsubmit = handleAddWorker;
    
    // Show modal
    modal.style.display = 'flex';
}

// Handle add worker form submission
function handleAddWorker(event) {
    event.preventDefault();
    
    // Get form values
    const workerData = {
        id: 'worker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId: 'external_' + Date.now(), // External workers don't have user accounts
        fullName: document.getElementById('workerFullName').value,
        mobile: document.getElementById('workerMobile').value,
        fatherName: document.getElementById('workerFatherName').value,
        age: document.getElementById('workerAge').value,
        profession: document.getElementById('workerProfession').value,
        experience: document.getElementById('workerExperience').value,
        dailyRate: document.getElementById('workerDailyRate').value,
        address: document.getElementById('workerAddress').value,
        area: document.getElementById('workerArea').value,
        pincode: document.getElementById('workerPincode').value,
        skills: document.getElementById('workerSkills').value
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0),
        isVerified: document.getElementById('workerVerified').checked,
        addedBy: currentProfessional.id,
        addedByName: currentProfessional.fullName,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    // Save worker
    saveWorker(workerData);
}

// Save worker to database
function saveWorker(workerData) {
    try {
        // Add to database
        LocalStorageDB.workers.add(workerData);
        
        // Update local list
        currentWorkers.push(workerData);
        
        // Update UI
        updateWorkerList();
        updateStats();
        
        // Close modal
        closeAddWorkerModal();
        
        // Show success message
        showNotification(`Worker "${workerData.fullName}" added successfully!`, 'success');
        
        // Reset form
        document.getElementById('addWorkerForm').reset();
        
    } catch (error) {
        console.error('Error saving worker:', error);
        showNotification('Error adding worker. Please try again.', 'error');
    }
}

// View worker details
function viewWorker(workerId) {
    const worker = currentWorkers.find(w => w.id === workerId);
    
    if (!worker) {
        showNotification('Worker not found', 'error');
        return;
    }
    
    currentViewingWorker = worker;
    const modal = document.getElementById('viewWorkerModal');
    const content = document.getElementById('workerDetailsContent');
    
    // Get profession details
    const professions = LocalStorageDB.professions.get();
    const professionData = professions.find(p => p.name.toLowerCase() === worker.profession);
    const professionName = professionData ? 
        `${professionData.icon} ${professionData.name} (${professionData.hindiName})` : 
        worker.profession;
    
    // Create details HTML
    content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Header -->
            <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: var(--radius);">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">
                    ${professionData ? professionData.icon : '👷'}
                </div>
                <h2 style="color: var(--text-dark);">${worker.fullName}</h2>
                <div style="color: var(--primary); font-weight: 600;">${professionName}</div>
            </div>
            
            <!-- Basic Info -->
            <div>
                <h4 style="color: var(--text-dark); margin-bottom: 1rem;">
                    <i class="fas fa-info-circle"></i> Basic Information
                </h4>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Mobile:</span>
                        <span style="font-weight: 600;">${worker.mobile}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Father's Name:</span>
                        <span style="font-weight: 600;">${worker.fatherName || 'Not specified'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Age:</span>
                        <span style="font-weight: 600;">${worker.age || 'Not specified'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Experience:</span>
                        <span style="font-weight: 600;">${worker.experience || 'Not specified'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Daily Rate:</span>
                        <span style="font-weight: 600; color: var(--success);">${worker.dailyRate || 'Negotiable'}</span>
                    </div>
                </div>
            </div>
            
            <!-- Address -->
            <div>
                <h4 style="color: var(--text-dark); margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt"></i> Address
                </h4>
                <div style="color: var(--text-dark);">
                    ${worker.address || 'Not specified'}
                </div>
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-top: 0.25rem;">
                    ${worker.area} - ${worker.pincode || ''}
                </div>
            </div>
            
            <!-- Skills -->
            ${worker.skills && worker.skills.length > 0 ? `
            <div>
                <h4 style="color: var(--text-dark); margin-bottom: 1rem;">
                    <i class="fas fa-tools"></i> Skills
                </h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${worker.skills.map(skill => `
                        <span style="padding: 0.25rem 0.75rem; background: var(--bg-light); color: var(--text-dark); border-radius: 2rem; font-size: 0.875rem;">
                            ${skill}
                        </span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Status -->
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
                        'This worker is verified and appears in search results' :
                        'This worker is not verified. Consider verifying for better visibility.'}
                </p>
            </div>
            
            <!-- Added Info -->
            <div style="padding: 1rem; background: var(--bg-light); border-radius: var(--radius);">
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.5rem;">
                    Added Information
                </div>
                <div style="color: var(--text-dark);">
                    Added by: ${worker.addedByName || 'You'}<br>
                    Added on: ${new Date(worker.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
}

// Edit current worker
function editCurrentWorker() {
    if (!currentViewingWorker) return;
    
    closeViewWorkerModal();
    
    // For now, we'll just show a message
    // In a real app, you would open an edit form
    showNotification('Edit feature will be available in the next version', 'info');
}

// Delete current worker
function deleteCurrentWorker() {
    if (!currentViewingWorker) return;
    
    if (confirm(`Are you sure you want to delete worker "${currentViewingWorker.fullName}"?`)) {
        try {
            // Remove from database
            const workers = LocalStorageDB.workers.get();
            const updatedWorkers = workers.filter(w => w.id !== currentViewingWorker.id);
            LocalStorageDB.workers.set(updatedWorkers);
            
            // Update local list
            currentWorkers = currentWorkers.filter(w => w.id !== currentViewingWorker.id);
            
            // Update UI
            updateWorkerList();
            updateStats();
            
            // Close modal
            closeViewWorkerModal();
            
            // Show success message
            showNotification('Worker deleted successfully', 'success');
            
        } catch (error) {
            console.error('Error deleting worker:', error);
            showNotification('Error deleting worker', 'error');
        }
    }
}

// View all workers
function viewAllWorkers() {
    showNotification('View all workers feature will be enhanced in next version', 'info');
    // For now, just show current workers in modal
}

// Manage payments
function managePayments() {
    showNotification('Payment management will be available in the next version with Razorpay integration', 'info');
}

// Download report
function downloadReport() {
    if (currentWorkers.length === 0) {
        showNotification('No workers to generate report', 'warning');
        return;
    }
    
    // Create report data
    const reportData = {
        professional: currentProfessional.fullName,
        totalWorkers: currentWorkers.length,
        generatedDate: new Date().toLocaleString(),
        workers: currentWorkers.map(w => ({
            name: w.fullName,
            profession: w.profession,
            area: w.area,
            mobile: w.mobile,
            status: w.isVerified ? 'Verified' : 'Pending'
        }))
    };
    
    // Convert to JSON string
    const reportJson = JSON.stringify(reportData, null, 2);
    
    // Create download link
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labourhub-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully', 'success');
}

// Close add worker modal
function closeAddWorkerModal() {
    const modal = document.getElementById('addWorkerModal');
    modal.style.display = 'none';
    document.getElementById('addWorkerForm').reset();
}

// Close view worker modal
function closeViewWorkerModal() {
    const modal = document.getElementById('viewWorkerModal');
    modal.style.display = 'none';
    currentViewingWorker = null;
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