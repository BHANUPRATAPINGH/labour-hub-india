// Customer Dashboard JavaScript

// Load professions into dropdown
function loadProfessions() {
    const professions = LocalStorageDB.professions.get();
    const select = document.getElementById('searchProfession');
    
    // Clear existing options except first
    select.innerHTML = '<option value="">All Professions - सभी पेशे</option>';
    
    // Add profession options
    professions.forEach(profession => {
        const option = document.createElement('option');
        option.value = profession.name.toLowerCase();
        option.textContent = `${profession.icon} ${profession.name} - ${profession.hindiName}`;
        select.appendChild(option);
    });
}

// Load quick categories
function loadQuickCategories() {
    const professions = LocalStorageDB.professions.get();
    const container = document.getElementById('quickCategories');
    
    // Take first 6 professions
    const quickProfessions = professions.slice(0, 6);
    
    let html = '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">';
    
    quickProfessions.forEach(profession => {
        html += `
            <button onclick="searchByProfession('${profession.name.toLowerCase()}')" 
                    class="btn" 
                    style="background: var(--bg-light); text-align: left; padding: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.25rem;">${profession.icon}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-dark);">${profession.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-gray);">${profession.hindiName}</div>
                </div>
                <i class="fas fa-arrow-right" style="color: var(--primary);"></i>
            </button>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Search workers
function searchWorkers() {
    const area = document.getElementById('searchArea').value.toLowerCase();
    const profession = document.getElementById('searchProfession').value;
    const experience = document.getElementById('searchExperience').value;
    
    // Get all workers
    let workers = LocalStorageDB.workers.get();
    
    // Apply filters
    let filteredWorkers = workers;
    
    if (area) {
        filteredWorkers = filteredWorkers.filter(worker => 
            worker.area.toLowerCase().includes(area) ||
            worker.address.toLowerCase().includes(area)
        );
    }
    
    if (profession) {
        filteredWorkers = filteredWorkers.filter(worker => 
            worker.profession.toLowerCase() === profession
        );
    }
    
    if (experience) {
        filteredWorkers = filteredWorkers.filter(worker => {
            if (!worker.experience) return false;
            
            switch(experience) {
                case 'fresher':
                    return worker.experience.toLowerCase().includes('fresher') || 
                           worker.experience.toLowerCase().includes('0') ||
                           worker.experience.toLowerCase().includes('new');
                case '1-3':
                    return worker.experience.includes('1') || 
                           worker.experience.includes('2') ||
                           worker.experience.includes('3');
                case '3-5':
                    return worker.experience.includes('3') || 
                           worker.experience.includes('4') ||
                           worker.experience.includes('5');
                case '5+':
                    return worker.experience.includes('5+') || 
                           worker.experience.includes('6') ||
                           worker.experience.includes('7') ||
                           worker.experience.includes('8') ||
                           worker.experience.includes('9') ||
                           worker.experience.includes('10');
                default:
                    return true;
            }
        });
    }
    
    // Display results
    displayWorkers(filteredWorkers);
}

// Search by current location (simulated)
function searchByCurrentLocation() {
    // In real app, use Geolocation API
    // For demo, we'll use common areas
    const areas = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
    const randomArea = areas[Math.floor(Math.random() * areas.length)];
    
    document.getElementById('searchArea').value = randomArea;
    
    // Show notification
    showNotification(`Searching workers in ${randomArea}...`, 'info');
    
    // Search after a delay
    setTimeout(searchWorkers, 500);
}

// Search by profession (quick category)
function searchByProfession(profession) {
    document.getElementById('searchProfession').value = profession;
    document.getElementById('searchArea').value = '';
    searchWorkers();
}

// Display workers
function displayWorkers(workers) {
    const container = document.getElementById('workersList');
    const resultsCount = document.getElementById('resultsCount');
    
    // Update results count
    resultsCount.textContent = `${workers.length} workers found`;
    
    if (workers.length === 0) {
        const template = document.getElementById('noResultsTemplate');
        const clone = template.content.cloneNode(true);
        container.innerHTML = '';
        container.appendChild(clone);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create worker cards
    workers.forEach(worker => {
        const template = document.getElementById('workerCardTemplate');
        const clone = template.content.cloneNode(true);
        
        // Fill worker data
        const card = clone.querySelector('.worker-card');
        card.dataset.workerId = worker.id;
        
        // Name
        card.querySelector('.worker-name').textContent = worker.fullName;
        
        // Profession
        const professions = LocalStorageDB.professions.get();
        const professionData = professions.find(p => p.name.toLowerCase() === worker.profession);
        const professionName = professionData ? 
            `${professionData.icon} ${professionData.name}` : 
            worker.profession;
        card.querySelector('.worker-profession').textContent = professionName;
        
        // Area
        card.querySelector('.worker-area').textContent = `${worker.area}, ${worker.pincode || ''}`;
        
        // Experience
        card.querySelector('.worker-experience').textContent = 
            worker.experience ? `Experience: ${worker.experience}` : 'Experience not specified';
        
        // Rate
        card.querySelector('.worker-rate').textContent = 
            worker.dailyRate ? `Rate: ${worker.dailyRate}/day` : 'Rate: Negotiable';
        
        // Add event listeners
        const contactBtn = card.querySelector('.contact-btn');
        const viewBtn = card.querySelector('.view-btn');
        
        contactBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            contactWorker(worker);
        });
        
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewWorkerDetails(worker);
        });
        
        // Add click event to entire card
        card.addEventListener('click', () => {
            viewWorkerDetails(worker);
        });
        
        container.appendChild(card);
    });
    
    // Update grid layout
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    container.style.gap = '1.5rem';
}

// Contact worker
function contactWorker(worker) {
    if (!worker) {
        const card = event.target.closest('.worker-card');
        const workerId = card.dataset.workerId;
        const workers = LocalStorageDB.workers.get();
        worker = workers.find(w => w.id === workerId);
    }
    
    if (worker && worker.mobile) {
        const phoneNumber = `+91${worker.mobile}`;
        
        // Create contact modal
        const modalHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: var(--radius-lg); max-width: 400px; width: 90%;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-dark);">
                        <i class="fas fa-phone"></i> Contact Worker
                    </h3>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <p><strong>Name:</strong> ${worker.fullName}</p>
                        <p><strong>Profession:</strong> ${worker.profession}</p>
                        <p><strong>Mobile:</strong> ${worker.mobile}</p>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem;">
                        <a href="tel:${phoneNumber}" class="btn btn-primary" style="flex: 1;">
                            <i class="fas fa-phone"></i> Call Now
                        </a>
                        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                                class="btn btn-outline">
                            Cancel
                        </button>
                    </div>
                    
                    <div style="margin-top: 1rem; padding: 1rem; background: #f0f9ff; border-radius: var(--radius); font-size: 0.875rem;">
                        <i class="fas fa-info-circle" style="color: var(--primary);"></i>
                        Always verify worker details before hiring
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// View worker details
function viewWorkerDetails(worker) {
    if (!worker) {
        const card = event.target.closest('.worker-card');
        const workerId = card.dataset.workerId;
        const workers = LocalStorageDB.workers.get();
        worker = workers.find(w => w.id === workerId);
    }
    
    if (worker) {
        const modal = document.getElementById('workerModal');
        const details = document.getElementById('modalWorkerDetails');
        
        // Get profession details
        const professions = LocalStorageDB.professions.get();
        const professionData = professions.find(p => p.name.toLowerCase() === worker.profession);
        const professionName = professionData ? 
            `${professionData.icon} ${professionData.name} (${professionData.hindiName})` : 
            worker.profession;
        
        // Create worker details HTML
        details.innerHTML = `
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
                
                <!-- Contact Info -->
                <div>
                    <h4 style="color: var(--text-dark); margin-bottom: 1rem;">
                        <i class="fas fa-address-book"></i> Contact Information
                    </h4>
                    <div style="display: grid; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-mobile-alt" style="color: var(--text-gray);"></i>
                            <span>${worker.mobile}</span>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.5rem;">
                            <i class="fas fa-map-marker-alt" style="color: var(--text-gray); margin-top: 0.25rem;"></i>
                            <div>
                                <div style="font-weight: 600;">${worker.area}</div>
                                <div style="color: var(--text-gray); font-size: 0.875rem;">${worker.address}</div>
                                <div style="color: var(--text-gray); font-size: 0.875rem;">Pincode: ${worker.pincode || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Info -->
                ${worker.skills ? `
                <div>
                    <h4 style="color: var(--text-dark); margin-bottom: 1rem;">
                        <i class="fas fa-tools"></i> Skills
                    </h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${worker.skills.map(skill => `
                            <span style="padding: 0.25rem 0.75rem; background: var(--bg-light); border-radius: 2rem; font-size: 0.875rem;">
                                ${skill}
                            </span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- Verification Status -->
                <div style="padding: 1rem; background: ${worker.isVerified ? '#d1fae5' : '#fef3c7'}; border-radius: var(--radius);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: ${worker.isVerified ? '#065f46' : '#92400e'};">
                        <i class="fas fa-${worker.isVerified ? 'badge-check' : 'user-clock'}"></i>
                        <span style="font-weight: 600;">
                            ${worker.isVerified ? 'Verified Worker' : 'Unverified - Contact with caution'}
                        </span>
                    </div>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem; color: ${worker.isVerified ? '#065f46' : '#92400e'};">
                        ${worker.isVerified ? 
                            'This worker has been verified by LabourHub' : 
                            'This worker is not verified. Please verify details before hiring.'}
                    </p>
                </div>
            </div>
        `;
        
        // Store current worker in modal for contact
        modal.dataset.currentWorker = JSON.stringify(worker);
        
        // Show modal
        modal.style.display = 'flex';
    }
}

// Contact worker from modal
function contactModalWorker() {
    const modal = document.getElementById('workerModal');
    const worker = JSON.parse(modal.dataset.currentWorker || '{}');
    closeModal();
    contactWorker(worker);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('workerModal');
    modal.style.display = 'none';
}

// Clear search
function clearSearch() {
    document.getElementById('searchArea').value = '';
    document.getElementById('searchProfession').value = '';
    document.getElementById('searchExperience').value = '';
    searchWorkers();
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
    if (!user.id || user.role !== 'customer') {
        window.location.href = '../auth/login.html';
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('workerModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
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