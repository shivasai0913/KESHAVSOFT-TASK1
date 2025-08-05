document.addEventListener('DOMContentLoaded', () => {
    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // In a real application, you would send this to your backend
            alert(`Thank you for your message, ${name}! We will get back to you soon at ${email}.`);
            contactForm.reset();
        });
    }

    // Pre-fill contact form with user data if logged in
    if (window.location.pathname.includes('contact.html')) {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');

            if (nameField && !nameField.value) {
                nameField.value = `${currentUser.firstName} ${currentUser.lastName}`;
            }

            if (emailField && !emailField.value) {
                emailField.value = currentUser.email;
            }
        }
    }

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });

    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();

        // Remove existing validation classes
        field.classList.remove('is-valid', 'is-invalid');

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(value)) {
                field.classList.add('is-valid');
            } else {
                field.classList.add('is-invalid');
            }
        }

        // Password validation
        if (field.type === 'password' && value) {
            if (value.length >= 6) {
                field.classList.add('is-valid');
            } else {
                field.classList.add('is-invalid');
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,}$/;
            if (phoneRegex.test(value)) {
                field.classList.add('is-valid');
            } else {
                field.classList.add('is-invalid');
            }
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            field.classList.add('is-invalid');
        } else if (field.hasAttribute('required') && value) {
            field.classList.add('is-valid');
        }
    }

    function clearValidation(e) {
        const field = e.target;
        field.classList.remove('is-valid', 'is-invalid');
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.classList.contains('show')) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        });
    }, 5000);

    // Add loading state to buttons on form submit
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        const form = button.closest('form');
        if (form) {
            form.addEventListener('submit', () => {
                button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
                button.disabled = true;

                // Re-enable button after 2 seconds (in case of error)
                setTimeout(() => {
                    button.innerHTML = button.textContent.includes('Sign In') ? 'Sign In' : 
                                     button.textContent.includes('Create Account') ? 'Create Account' : 
                                     'Send Message';
                    button.disabled = false;
                }, 2000);
            });
        }
    });
});

// Utility functions
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Debug function to clear all localStorage data
function clearAllData() {
    if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
        localStorage.clear();
        alert('All data cleared. You will be redirected to the login page.');
        window.location.href = 'index.html';
    }
}