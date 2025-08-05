# INFOSHELL Authentication System

## Overview
This is a complete authentication system for the INFOSHELL website that implements user registration, login, and session management using browser localStorage to store user data in JSON format.

## Files Structure

### HTML Files
- `index.html` - Entry point that redirects to login or main page based on authentication
- `login.html` - User login form
- `signup.html` - User registration form  
- `main.html` - Main authenticated homepage
- `about.html` - About page (requires authentication)
- `contact.html` - Contact page (requires authentication)

### JavaScript Files
- `auth.js` - Complete authentication system with JSON data storage
- `scripts.js` - Enhanced UI functionality and form validation

### CSS Files
- `styles.css` - Enhanced styling for authentication and responsive design

### Data Files
- `sample_users.json` - Example of the JSON data structure used for user storage

## How It Works

### 1. Entry Point (index.html)
- When users visit the website, they first land on `index.html`
- The page checks if the user is authenticated
- If authenticated: redirects to `main.html`
- If not authenticated: redirects to `login.html`

### 2. User Registration (signup.html)
- Users can create new accounts with the following fields:
  - First Name
  - Last Name
  - Email Address
  - Password (minimum 6 characters)
  - Phone Number
  - Terms agreement checkbox
- Form includes real-time validation
- User data is stored in localStorage as JSON
- After successful registration, redirects to login page

### 3. User Login (login.html)
- Users can sign in with email and password
- "Remember me" option available
- After successful login, redirects to main page
- Failed login attempts show error messages

### 4. Authenticated Pages
- `main.html`, `about.html`, `contact.html` require authentication
- Navigation includes user welcome message and logout option
- Automatic redirect to login if not authenticated

### 5. Data Storage
- User data is stored in browser localStorage
- Storage key: `infoshell_users` (array of user objects)
- Current user key: `infoshell_current_user` (current session)
- Data persists between browser sessions

## JSON Data Structure

Each user object contains:
```json
{
  "id": "unique_timestamp_id",
  "firstName": "User's first name",
  "lastName": "User's last name", 
  "email": "user@example.com",
  "password": "user_password",
  "phone": "+1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T10:30:00.000Z"
}
```

## Features

### Authentication Features
- ✅ User registration with validation
- ✅ User login with credential verification
- ✅ Session management
- ✅ Auto-redirect based on authentication status
- ✅ Logout functionality
- ✅ "Remember me" option
- ✅ Password confirmation validation

### UI/UX Features
- ✅ Responsive design for all devices
- ✅ Bootstrap 5 styling
- ✅ Real-time form validation
- ✅ Loading states for form submissions
- ✅ Success/error message alerts
- ✅ Smooth animations and transitions
- ✅ User profile dropdown
- ✅ Auto-fill contact form with user data

### Data Management Features
- ✅ JSON storage in localStorage
- ✅ User data persistence
- ✅ Export functionality for admin use
- ✅ Debug functions for development

## Usage Instructions

### For Users
1. Visit `index.html` to start
2. New users: Click "Sign up here" to create account
3. Existing users: Enter email and password to login
4. Navigate through the authenticated pages
5. Use dropdown menu to access profile or logout

### For Developers
1. Open browser developer console
2. Use `viewUsers()` to see all registered users
3. Use `exportUsers()` to download user data as JSON
4. Use `clearAllData()` to reset all stored data

## Security Notes
- This is a client-side only system for demonstration
- Passwords are stored in plain text (not recommended for production)  
- For production use, implement:
  - Server-side authentication
  - Password hashing
  - HTTPS encryption
  - JWT tokens
  - Input sanitization
  - Rate limiting

## Browser Compatibility
- Works in all modern browsers that support localStorage
- Responsive design works on desktop, tablet, and mobile
- Bootstrap 5 and vanilla JavaScript used for maximum compatibility

## Customization
- Modify `auth.js` to change authentication logic
- Update `styles.css` for different visual themes
- Modify form fields in HTML files as needed
- Add additional validation in JavaScript files

## File Dependencies
```
index.html
├── auth.js (authentication system)
├── styles.css (styling)
└── Bootstrap 5 CDN

login.html
├── auth.js
├── styles.css
└── Bootstrap 5 CDN

signup.html  
├── auth.js
├── styles.css
└── Bootstrap 5 CDN

main.html
├── auth.js
├── scripts.js (UI enhancements)
├── styles.css
└── Bootstrap 5 CDN

about.html / contact.html
├── auth.js
├── scripts.js
├── styles.css
└── Bootstrap 5 CDN
```