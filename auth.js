// Authentication System with JSON Storage
class AuthSystem {
    constructor() {
        this.storageKey = 'infoshell_users';
        this.currentUserKey = 'infoshell_current_user';
        this.initializeStorage();
    }

    // Initialize storage if it doesn't exist
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Get all users from storage
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (e) {
            console.error('Error parsing users data:', e);
            return [];
        }
    }

    // Save users to storage
    saveUsers(users) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('Error saving users data:', e);
            return false;
        }
    }

    // Register new user
    register(userData) {
        const users = this.getUsers();

        // Check if user already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists!' };
        }

        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password, // In real app, this should be hashed
            phone: userData.phone,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        // Add user to array
        users.push(newUser);

        // Save to storage
        if (this.saveUsers(users)) {
            return { success: true, message: 'Account created successfully!', user: newUser };
        } else {
            return { success: false, message: 'Error creating account. Please try again.' };
        }
    }

    // Login user
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.saveUsers(users);

            // Set current user
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            return { success: true, message: 'Login successful!', user: user };
        } else {
            return { success: false, message: 'Invalid email or password!' };
        }
    }

    // Get current user
    getCurrentUser() {
        try {
            const currentUser = localStorage.getItem(this.currentUserKey);
            return currentUser ? JSON.parse(currentUser) : null;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.currentUserKey);
        return true;
    }

    // Export user data as JSON
    exportUserData() {
        const users = this.getUsers();
        const dataStr = JSON.stringify(users, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'infoshell_users.json';
        link.click();
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Global functions for easy access
function checkAuth() {
    return auth.isAuthenticated();
}

function requireAuth() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    auth.logout();
    window.location.href = 'login.html';
}

// DOM Content Loaded Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showMessage('loginMessage', 'Please fill in all fields.', 'danger');
                return;
            }

            const result = auth.login(email, password);

            if (result.success) {
                showMessage('loginMessage', result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1000);
            } else {
                showMessage('loginMessage', result.message, 'danger');
            }
        });
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const phone = document.getElementById('phoneNumber').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;

            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
                showMessage('signupMessage', 'Please fill in all required fields.', 'danger');
                return;
            }

            if (password.length < 6) {
                showMessage('signupMessage', 'Password must be at least 6 characters long.', 'danger');
                return;
            }

            if (password !== confirmPassword) {
                showMessage('signupMessage', 'Passwords do not match.', 'danger');
                return;
            }

            if (!agreeTerms) {
                showMessage('signupMessage', 'Please agree to the Terms of Service.', 'danger');
                return;
            }

            // Register user
            const userData = { firstName, lastName, email, password, phone };
            const result = auth.register(userData);

            if (result.success) {
                showMessage('signupMessage', result.message + ' Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage('signupMessage', result.message, 'danger');
            }
        });

        // Password confirmation validation
        const passwordField = document.getElementById('signupPassword');
        const confirmPasswordField = document.getElementById('confirmPassword');

        function validatePasswordMatch() {
            if (confirmPasswordField.value && passwordField.value !== confirmPasswordField.value) {
                confirmPasswordField.setCustomValidity('Passwords do not match');
            } else {
                confirmPasswordField.setCustomValidity('');
            }
        }

        if (passwordField && confirmPasswordField) {
            passwordField.addEventListener('input', validatePasswordMatch);
            confirmPasswordField.addEventListener('input', validatePasswordMatch);
        }
    }

    // Main page authentication check and user welcome
    if (window.location.pathname.includes('main.html') || 
        window.location.pathname.includes('about.html') || 
        window.location.pathname.includes('contact.html')) {

        if (!requireAuth()) return;

        // Update user welcome message
        const currentUser = auth.getCurrentUser();
        const userWelcome = document.getElementById('userWelcome');
        if (userWelcome && currentUser) {
            userWelcome.textContent = `Welcome, ${currentUser.firstName}!`;
        }

        // Logout button handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    logout();
                }
            });
        }

        // Profile link handler (placeholder)
        const profileLink = document.getElementById('profileLink');
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Profile for ${currentUser.firstName} ${currentUser.lastName}\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}`);
            });
        }
    }
});

// Utility function to show messages
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

// Export function for admin use (can be called from console)
function exportUsers() {
    auth.exportUserData();
}

// Debug function to view current users (can be called from console)
function viewUsers() {
    console.log('Current Users:', auth.getUsers());
    console.log('Current User:', auth.getCurrentUser());
}