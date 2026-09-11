# SkillSwap Authentication & Profile - Quick Start Guide

## Accessing the New Features

### 1. Login Page
**URL:** `http://localhost:3000/#login`

**Features:**
- Email/password login
- Remember me checkbox
- Social login buttons (Google, Microsoft)
- Forgot password link
- Sign up link

**Test Credentials:**
```
Email: arjun.sharma@skillswap.com
Password: Arjun@123
```
(Create actual test accounts via signup)

### 2. Sign Up Page
**URL:** `http://localhost:3000/#signup`

**3-Step Process:**
1. **Step 1 - Basic Info:** First name, last name, email, password, location
2. **Step 2 - Skills:** Teaching skills and learning goals
3. **Step 3 - Preferences:** Exchange mode, availability, languages

**Key Features:**
- Progress bar showing completion
- Form validation with error messages
- Skill tag management
- Indian language options
- Terms of service agreement

### 3. User Profile
**URL:** `http://localhost:3000/#profile`

**Tabs:**
- **Overview:** Bio, preferences, badges
- **Skills:** Teaching vs learning skills
- **Progress:** Milestone tracking
- **Reviews:** Rating breakdown
- **Credentials:** Verification status

---

## Using the Authentication Service

### In Your JavaScript:

```javascript
import { AuthService } from './services/authService.js';
import { store } from './store/state.js';

const authService = new AuthService(store);

// Login
try {
  const result = await authService.login('email@example.com', 'Password123');
  console.log('Login successful:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Signup
try {
  const newUser = await authService.signup({
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjun@example.com',
    password: 'SecurePass123',
    location: 'Mumbai, India',
    bio: 'Guitar instructor and tech enthusiast',
    skillsTeach: [{ name: 'Guitar', category: 'Music & Audio', level: 'Expert', description: 'Acoustic guitar' }],
    skillsWant: [{ name: 'Python', category: 'Technology', targetLevel: 'Intermediate', goal: 'Learn Python' }],
    mode: 'online',
    availability: ['Weekends', 'Evenings'],
    languages: ['English', 'Hindi']
  });
  console.log('Account created:', newUser);
} catch (error) {
  console.error('Signup failed:', error.message);
}

// Update Profile
const result = authService.updateProfile('user-123', {
  bio: 'Updated bio',
  location: 'Bangalore, India',
  availability: ['Weekdays', 'Weekends']
});

// Search Users
const results = authService.searchUsers('Python');

// Get Recommendations
const recommendations = authService.getUserRecommendations('user-123');

// Logout
authService.logout();
```

---

## Validation Rules

### Email
- Must contain @ and domain
- Example: `user@skillswap.com`

### Password (Basic)
- Minimum 6 characters
- Used for login

### Password (Strong - Signup)
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- Example: `SecurePass123`

### Skills
- At least 1 skill to teach
- At least 1 skill to learn
- Can add unlimited skills

---

## Indian User Profiles in Mock Data

### Sample Users:

1. **Arjun Sharma** (Mumbai)
   - Teaching: Guitar, Music Theory
   - Learning: Digital Art, UI/UX Design

2. **Priya Desai** (Bangalore)
   - Teaching: Digital Art, Character Design
   - Learning: Guitar, Music Theory

3. **Vikram Reddy** (Delhi)
   - Teaching: Python, Web Development
   - Learning: Public Speaking, Photography

4. **Sneha Gupta** (Kolkata)
   - Teaching: Photography, Video Editing
   - Learning: Guitar, Public Speaking

5. **Rohan Kapoor** (Hyderabad)
   - Teaching: Public Speaking, Presentation Design
   - Learning: Python, Guitar

6. **Neha Verma** (Pune)
   - Teaching: Hindi Language, Culinary Arts
   - Learning: Digital Art, UI/UX Design

7. **Ananya Patel** (Bangalore)
   - Teaching: Guitar, Public Speaking
   - Learning: Photoshop, Photography

---

## CSS Customization

### Colors
Edit `css/variables.css`:
```css
--primary: #667eea;        /* Primary brand color */
--success: #2ecc71;        /* Success state */
--error: #dc3545;          /* Error state */
--bg-default: #f5f7fa;     /* Background */
--text-primary: #1a1a1a;   /* Main text */
```

### Login/Signup Pages
- Gradient background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Max width: 600px
- Padding: Responsive with `var(--space-*)`

### Profile Page
- Header gradient same as above
- Tab-based navigation
- Responsive grid layout

---

## File Structure

```
skillswap/
├── js/
│   ├── views/
│   │   ├── loginView.js         ← New
│   │   ├── signupView.js        ← New
│   │   ├── profileView.js       ← Enhanced
│   │   └── ... other views
│   ├── services/
│   │   ├── authService.js       ← New
│   │   └── ... other services
│   └── app.js                   ← Updated
├── css/
│   ├── auth-profile.css         ← New
│   └── ... other styles
├── index.html                   ← Updated
└── ... other files
```

---

## Common Use Cases

### 1. Redirect to Login if Not Authenticated
```javascript
if (!authService.isAuthenticated()) {
  window.location.hash = '#login';
}
```

### 2. Get Current User's Skills
```javascript
const user = authService.getCurrentUser();
const teachingSkills = user.skillsTeach;
const learningGoals = user.skillsWant;
```

### 3. Find Compatible Partners
```javascript
const user = authService.getCurrentUser();
const partners = authService.getUserRecommendations(user.id);
// Returns users who teach what I want to learn
```

### 4. Update User After Skill Exchange
```javascript
authService.updateProfile(userId, {
  bio: 'Just learned Python basics!',
  skillCredits: user.skillCredits + 1
});
```

---

## Error Handling

### Login Errors
```javascript
try {
  await authService.login(email, password);
} catch (error) {
  // Possible errors:
  // - 'Email and password are required'
  // - 'Please enter a valid email address'
  // - 'User not found...'
  // - 'Incorrect password'
  console.error(error.message);
}
```

### Signup Errors
```javascript
try {
  await authService.signup(userData);
} catch (error) {
  // Possible errors:
  // - 'All fields are required'
  // - 'Invalid email format'
  // - 'Password must be at least 8 characters...'
  // - 'Email already registered'
  console.error(error.message);
}
```

---

## Security Notes

### Current Implementation
- Uses localStorage for session storage
- Passwords stored in mock data (for demo)
- Client-side validation only

### Production Recommendations
1. **Passwords:** Hash using bcrypt server-side
2. **Session:** Use secure JWT tokens
3. **Storage:** Use secure httpOnly cookies
4. **Validation:** Validate all inputs server-side
5. **HTTPS:** Always use HTTPS in production
6. **Rate Limiting:** Implement on login attempts

---

## Testing Checklist

### Login Page
- [ ] Can view login form
- [ ] Email validation works
- [ ] Password validation works
- [ ] Can enter credentials and submit
- [ ] Error messages display correctly
- [ ] Remember me checkbox works
- [ ] Sign up link navigates to signup

### Signup Page
- [ ] Can view all three steps
- [ ] Form validation on each step
- [ ] Progress bar updates
- [ ] Can navigate between steps
- [ ] Skill tags can be added/removed
- [ ] All Indian languages available
- [ ] Form submits and creates user

### Profile Page
- [ ] All tabs are clickable
- [ ] Correct information displays
- [ ] Edit profile modal works
- [ ] Can update user info
- [ ] Skills display correctly
- [ ] Badges show
- [ ] Responsive on mobile

---

## Support & Troubleshooting

### Page Not Loading?
1. Check console for JavaScript errors
2. Verify you're using correct URL format (#view-name)
3. Ensure all CSS files are loaded
4. Check Network tab for failed requests

### Form Not Validating?
1. Check browser console for error messages
2. Verify field values meet requirements
3. Try different test data
4. Check that authService is properly imported

### CSS Not Applying?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check that auth-profile.css is in correct path
4. Verify it's linked in index.html

---

## Next Steps

1. **Test the features** with provided mock data
2. **Integrate with backend** for real authentication
3. **Add email verification** for security
4. **Implement OAuth** for social logins
5. **Add password recovery** flow
6. **Set up database** for user persistence

---

**Happy coding! 🚀**

For more information, see `CHANGES.md` for detailed technical documentation.
