// File: pastpapers_app/static/js/scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Add download tracking
    trackDownloads();
    
    // Add keyboard navigation support
    addKeyboardNavigation();
    
    // Add loading states for downloads
    addDownloadLoadingStates();
    
    console.log('Past Papers Bank initialized successfully');
}

/**
 * Toggle subject accordion
 */
function toggleSubject(element) {
    const accordion = element.closest('.subject-accordion');
    const content = accordion.querySelector('.subject-content');
    const icon = accordion.querySelector('.accordion-icon');
    
    // Close other accordions
    document.querySelectorAll('.subject-accordion').forEach(acc => {
        if (acc !== accordion && acc.classList.contains('active')) {
            acc.classList.remove('active');
            acc.querySelector('.subject-content').style.maxHeight = '0';
            acc.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current accordion
    accordion.classList.toggle('active');
    
    if (accordion.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
        
        // Smooth scroll to the accordion
        setTimeout(() => {
            accordion.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    } else {
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    }
}

/**
 * Show specific tab content
 */
function showTab(button, tabId) {
    const tabContainer = button.closest('.tabs');
    const allButtons = tabContainer.querySelectorAll('.tab-button');
    const allContents = tabContainer.querySelectorAll('.tab-content');
    
    // Remove active class from all buttons and contents
    allButtons.forEach(btn => btn.classList.remove('active'));
    allContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked button and corresponding content
    button.classList.add('active');
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // Add fade-in animation
        targetContent.style.opacity = '0';
        setTimeout(() => {
            targetContent.style.opacity = '1';
        }, 50);
    }
}

/**
 * Add smooth scrolling for anchor links
 */
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Track download clicks for analytics
 */
function trackDownloads() {
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const paperCard = this.closest('.paper-card');
            const paperName = paperCard.querySelector('h5').textContent;
            
            // Log download (you can replace this with actual analytics)
            console.log(`Download initiated: ${paperName}`);
            
            // You can add Google Analytics or other tracking here
            // gtag('event', 'download', {
            //     'file_name': paperName,
            //     'event_category': 'engagement'
            // });
        });
    });
}

/**
 * Add keyboard navigation support
 */
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes all accordions
        if (e.key === 'Escape') {
            closeAllAccordions();
        }
        
        // Enter or Space on accordion headers
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('subject-header')) {
            e.preventDefault();
            toggleSubject(e.target);
        }
    });
    
    // Make accordion headers focusable
    document.querySelectorAll('.subject-header').forEach(header => {
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        
        header.addEventListener('focus', function() {
            this.style.outline = '2px solid #3498db';
        });
        
        header.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

/**
 * Close all open accordions
 */
function closeAllAccordions() {
    document.querySelectorAll('.subject-accordion.active').forEach(accordion => {
        accordion.classList.remove('active');
        accordion.querySelector('.subject-content').style.maxHeight = '0';
        accordion.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
        accordion.querySelector('.subject-header').setAttribute('aria-expanded', 'false');
    });
}

/**
 * Add loading states for downloads
 */
function addDownloadLoadingStates() {
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const originalContent = this.innerHTML;
            
            // Add loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            this.style.pointerEvents = 'none';
            
            // Reset after 3 seconds (adjust based on your needs)
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
    });
}

/**
 * Search functionality (if you want to add search later)
 */
function searchPapers(query) {
    const searchTerm = query.toLowerCase();
    const paperCards = document.querySelectorAll('.paper-card');
    const subjects = document.querySelectorAll('.subject-accordion');
    
    let hasVisibleResults = false;
    
    subjects.forEach(subject => {
        const subjectName = subject.querySelector('.subject-info h3').textContent.toLowerCase();
        const subjectPapers = subject.querySelectorAll('.paper-card');
        let subjectHasVisiblePapers = false;
        
        subjectPapers.forEach(paper => {
            const paperText = paper.textContent.toLowerCase();
            const shouldShow = paperText.includes(searchTerm) || subjectName.includes(searchTerm);
            
            paper.style.display = shouldShow ? 'flex' : 'none';
            if (shouldShow) {
                subjectHasVisiblePapers = true;
                hasVisibleResults = true;
            }
        });
        
        // Show/hide entire subject based on whether it has visible papers
        subject.style.display = subjectHasVisiblePapers ? 'block' : 'none';
        
        // Auto-expand subjects with matching papers
        if (subjectHasVisiblePapers && searchTerm) {
            subject.classList.add('active');
            subject.querySelector('.subject-content').style.maxHeight = 
                subject.querySelector('.subject-content').scrollHeight + 'px';
        }
    });
    
    // Show/hide no results message
    showNoResultsMessage(!hasVisibleResults && searchTerm);
}

/**
 * Show or hide no results message
 */
function showNoResultsMessage(show) {
    let noResultsDiv = document.querySelector('.no-search-results');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-search-results no-papers';
        noResultsDiv.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No Results Found</h3>
            <p>Try adjusting your search terms or browse all subjects.</p>
        `;
        document.querySelector('.subjects-container').appendChild(noResultsDiv);
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

/**
 * Utility function to format file sizes
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Add animation delays for staggered loading effect
 */
function addStaggeredAnimations() {
    const accordions = document.querySelectorAll('.subject-accordion');
    accordions.forEach((accordion, index) => {
        accordion.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize staggered animations when page loads
document.addEventListener('DOMContentLoaded', addStaggeredAnimations);

/**
 * Handle responsive navigation for mobile
 */
function handleMobileNavigation() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Close all accordions on mobile for better UX
        document.querySelectorAll('.subject-accordion.active').forEach(accordion => {
            // Don't auto-close, let user control
        });
    }
}

// Listen for window resize
window.addEventListener('resize', handleMobileNavigation);

/**
 * Add error handling for failed downloads
 */
document.addEventListener('DOMContentLoaded', function() {
    // Handle download errors
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const link = this;
            
            // Create a temporary link to test if file exists
            fetch(this.href, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('File not found');
                    }
                })
                .catch(error => {
                    e.preventDefault();
                    showErrorMessage('Sorry, this file is currently unavailable. Please try again later.');
                    console.error('Download error:', error);
                });
        });
    });
});

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    // Create and show a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Add CSS for error message animation
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);
