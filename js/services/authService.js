/**
 * SkillSwap Authentication Utilities
 * Manages user login, logout, session, and authentication state
 */

export class AuthService {
  constructor(state) {
    this.state = state;
    this.sessionKey = 'SKILLSWAP_SESSION';
    this.rememberMeKey = 'SKILLSWAP_REMEMBERED_EMAIL';
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  isValidPassword(password) {
    return password && password.length >= 6;
  }

  /**
   * Validate password strength (stricter)
   */
  isStrongPassword(password) {
    if (!password || password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers;
  }

  /**
   * Attempt user login
   */
  async login(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Validate inputs
        if (!email || !password) {
          reject({ message: 'Email and password are required' });
          return;
        }

        if (!this.isValidEmail(email)) {
          reject({ message: 'Please enter a valid email address' });
          return;
        }

        // Find user by email
        const user = this.state.users.find(u => u.email === email);

        if (!user) {
          reject({ message: 'User not found. Please check your email or create an account.' });
          return;
        }

        // Verify password
        if (user.password !== password) {
          reject({ message: 'Incorrect password. Please try again.' });
          return;
        }

        // Update session
        this.setCurrentUser(user.id);
        resolve({
          success: true,
          user: this.sanitizeUserData(user),
          message: 'Login successful'
        });
      }, 800);
    });
  }

  /**
   * Register new user
   */
  async signup(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate required fields
        if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
          reject({ message: 'All fields are required' });
          return;
        }

        if (!this.isValidEmail(userData.email)) {
          reject({ message: 'Invalid email format' });
          return;
        }

        if (!this.isStrongPassword(userData.password)) {
          reject({ 
            message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' 
          });
          return;
        }

        // Check if email already exists
        if (this.state.users.find(u => u.email === userData.email)) {
          reject({ message: 'Email already registered. Please login or use a different email.' });
          return;
        }

        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password, // Note: In production, use hashed passwords
          location: userData.location || '',
          bio: userData.bio || '',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          role: userData.role || 'Member',
          headline: userData.headline || '',
          online: true,
          verified: false,
          rating: 0,
          ratingCount: 0,
          completedExchanges: 0,
          teachingHours: 0,
          skillCredits: 3, // Welcome bonus
          streakDays: 0,
          exchangeScore: 50,
          mode: userData.mode || 'online',
          availability: userData.availability || ['Weekends', 'Evenings'],
          languages: userData.languages || ['English'],
          skillsTeach: userData.skillsTeach || [],
          skillsWant: userData.skillsWant || [],
          badges: [],
          progress: [],
          ratingsBreakdown: {
            teachingQuality: 0,
            communication: 0,
            reliability: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Add user to state
        this.state.users.push(newUser);
        this.state.saveState();

        // Set as current user
        this.setCurrentUser(newUser.id);

        resolve({
          success: true,
          user: this.sanitizeUserData(newUser),
          message: 'Account created successfully'
        });
      }, 1000);
    });
  }

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    this.state.state.currentUserId = this.state.users[0]?.id || 'user-alex';
    this.state.saveState();
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Set current user
   */
  setCurrentUser(userId) {
    this.state.state.currentUserId = userId;
    this.state.saveState();
    
    // Save session
    localStorage.setItem(this.sessionKey, JSON.stringify({
      userId,
      timestamp: Date.now()
    }));
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.state.getCurrentUser();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const session = localStorage.getItem(this.sessionKey);
    if (session) {
      try {
        const data = JSON.parse(session);
        const user = this.state.users.find(u => u.id === data.userId);
        return !!user;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Get remembered email
   */
  getRememberedEmail() {
    return localStorage.getItem(this.rememberMeKey) || '';
  }

  /**
   * Save remembered email
   */
  saveRememberedEmail(email) {
    if (email) {
      localStorage.setItem(this.rememberMeKey, email);
    }
  }

  /**
   * Clear remembered email
   */
  clearRememberedEmail() {
    localStorage.removeItem(this.rememberMeKey);
  }

  /**
   * Update user profile
   */
  updateProfile(userId, profileData) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Update allowed fields
    const allowedFields = ['name', 'headline', 'bio', 'avatar', 'location', 'mode', 'availability', 'languages'];
    allowedFields.forEach(field => {
      if (profileData.hasOwnProperty(field)) {
        user[field] = profileData[field];
      }
    });

    user.updatedAt = new Date().toISOString();
    this.state.saveState();

    return {
      success: true,
      user: this.sanitizeUserData(user),
      message: 'Profile updated successfully'
    };
  }

  /**
   * Add or update user skills
   */
  updateUserSkills(userId, skillsTeach, skillsWant) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (skillsTeach) {
      user.skillsTeach = skillsTeach;
    }
    if (skillsWant) {
      user.skillsWant = skillsWant;
    }

    user.updatedAt = new Date().toISOString();
    this.state.saveState();

    return {
      success: true,
      user: this.sanitizeUserData(user),
      message: 'Skills updated successfully'
    };
  }

  /**
   * Change password
   */
  async changePassword(userId, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.state.users.find(u => u.id === userId);
        if (!user) {
          reject({ message: 'User not found' });
          return;
        }

        if (user.password !== oldPassword) {
          reject({ message: 'Current password is incorrect' });
          return;
        }

        if (!this.isStrongPassword(newPassword)) {
          reject({ 
            message: 'New password must be at least 8 characters with uppercase, lowercase, and numbers' 
          });
          return;
        }

        user.password = newPassword;
        user.updatedAt = new Date().toISOString();
        this.state.saveState();

        resolve({ success: true, message: 'Password changed successfully' });
      }, 800);
    });
  }

  /**
   * Verify email (placeholder for email verification)
   */
  async verifyEmail(userId, verificationCode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.state.users.find(u => u.id === userId);
        if (!user) {
          reject({ message: 'User not found' });
          return;
        }

        // In production, this would validate against sent code
        user.emailVerified = true;
        this.state.saveState();

        resolve({ success: true, message: 'Email verified successfully' });
      }, 500);
    });
  }

  /**
   * Sanitize user data (remove sensitive info)
   */
  sanitizeUserData(user) {
    const sanitized = { ...user };
    delete sanitized.password;
    return sanitized;
  }

  /**
   * Search users by skill or name
   */
  searchUsers(query, excludeCurrentUser = true) {
    const currentUser = this.getCurrentUser();
    const lowerQuery = query.toLowerCase();

    return this.state.users.filter(user => {
      if (excludeCurrentUser && user.id === currentUser.id) return false;

      const nameMatch = user.name.toLowerCase().includes(lowerQuery);
      const locationMatch = user.location.toLowerCase().includes(lowerQuery);
      const skillMatch = user.skillsTeach.some(s => s.name.toLowerCase().includes(lowerQuery)) ||
                        user.skillsWant.some(s => s.name.toLowerCase().includes(lowerQuery));

      return nameMatch || locationMatch || skillMatch;
    }).map(u => this.sanitizeUserData(u));
  }

  /**
   * Get user recommendations
   */
  getUserRecommendations(userId, limit = 5) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return [];

    // Find users with complementary skills
    const recommendations = this.state.users.filter(u => {
      if (u.id === userId) return false;
      
      // Check if user teaches something the current user wants to learn
      const userTeachesWhatIWant = u.skillsTeach.some(teach =>
        user.skillsWant.some(want => want.name.toLowerCase() === teach.name.toLowerCase())
      );

      // Check if I teach what the user wants to learn
      const iTeachWhatUserWants = user.skillsTeach.some(teach =>
        u.skillsWant.some(want => want.name.toLowerCase() === teach.name.toLowerCase())
      );

      return userTeachesWhatIWant || iTeachWhatUserWants;
    });

    return recommendations.slice(0, limit).map(u => this.sanitizeUserData(u));
  }
}

export default AuthService;
