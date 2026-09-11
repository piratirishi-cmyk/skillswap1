/**
 * SkillSwap Login View
 * Handles user authentication and login flow
 */

export class LoginView {
  constructor(state) {
    this.state = state;
    this.errorMessage = '';
    this.isLoading = false;
  }

  render() {
    const currentUser = this.state.getCurrentUser();
    
    return `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>Welcome Back to SkillSwap</h1>
            <p class="subtitle">Trade skills. Grow together.</p>
          </div>

          <form class="login-form" id="loginForm">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email"
                required
                class="form-control"
              />
              <span class="error-hint" id="emailError"></span>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password"
                required
                class="form-control"
              />
              <span class="error-hint" id="passwordError"></span>
            </div>

            <div class="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe"
              />
              <label for="rememberMe" class="checkbox-label">Remember me</label>
            </div>

            ${this.errorMessage ? `<div class="alert alert-danger">${this.errorMessage}</div>` : ''}

            <button 
              type="submit" 
              class="btn btn-primary btn-lg btn-block"
              ${this.isLoading ? 'disabled' : ''}
            >
              ${this.isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div class="login-divider">or</div>

          <div class="social-login">
            <button class="btn btn-social btn-google" id="googleLoginBtn">
              <span class="icon">📧</span> Sign in with Google
            </button>
            <button class="btn btn-social btn-microsoft" id="microsoftLoginBtn">
              <span class="icon">🔵</span> Sign in with Microsoft
            </button>
          </div>

          <div class="login-footer">
            <p class="forgot-password">
              <a href="#" class="link-primary" id="forgotPasswordLink">Forgot your password?</a>
            </p>
            <p class="signup-prompt">
              Don't have an account? 
              <a href="#" class="link-primary" id="signupLink">Create one now</a>
            </p>
          </div>
        </div>

        <div class="login-sidebar">
          <div class="sidebar-content">
            <h2>Why Join SkillSwap?</h2>
            <ul class="benefits-list">
              <li>
                <span class="benefit-icon">🎓</span>
                <span class="benefit-text">Learn new skills from passionate experts</span>
              </li>
              <li>
                <span class="benefit-icon">🤝</span>
                <span class="benefit-text">Teach what you know best</span>
              </li>
              <li>
                <span class="benefit-icon">💎</span>
                <span class="benefit-text">Earn skill credits for every session</span>
              </li>
              <li>
                <span class="benefit-icon">🌍</span>
                <span class="benefit-text">Connect with learners worldwide</span>
              </li>
              <li>
                <span class="benefit-icon">📈</span>
                <span class="benefit-text">Build your profile and get verified</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('loginForm');
    const signupLink = document.getElementById('signupLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const microsoftLoginBtn = document.getElementById('microsoftLoginBtn');

    if (form) {
      form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (signupLink) {
      signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('signup');
      });
    }

    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showForgotPasswordModal();
      });
    }

    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => this.handleSocialLogin('google'));
    }

    if (microsoftLoginBtn) {
      microsoftLoginBtn.addEventListener('click', () => this.handleSocialLogin('microsoft'));
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.clearErrors();

    const email = document.getElementById('email')?.value || '';
    const password = document.getElementById('password')?.value || '';
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    // Validation
    if (!email) {
      this.showError('emailError', 'Email is required');
      return;
    }
    if (!this.isValidEmail(email)) {
      this.showError('emailError', 'Please enter a valid email');
      return;
    }
    if (!password) {
      this.showError('passwordError', 'Password is required');
      return;
    }
    if (password.length < 6) {
      this.showError('passwordError', 'Password must be at least 6 characters');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate authentication delay
    setTimeout(() => {
      const user = this.state.users.find(u => u.email === email);
      
      if (user && user.password === password) {
        this.state.state.currentUserId = user.id;
        this.state.saveState();
        
        if (rememberMe) {
          localStorage.setItem('SKILLSWAP_REMEMBERED_EMAIL', email);
        }

        this.showSuccessToast('Login successful! Redirecting...');
        setTimeout(() => this.navigateTo('dashboard'), 1500);
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
        this.isLoading = false;
        this.render();
      }
    }, 800);
  }

  handleSocialLogin(provider) {
    console.log(`Logging in with ${provider}...`);
    this.showInfoToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is being set up.`);
    // Integration with OAuth providers would go here
  }

  showForgotPasswordModal() {
    const email = prompt('Enter your email address to reset your password:');
    if (email && this.isValidEmail(email)) {
      this.showSuccessToast('Password reset link sent to your email!');
    } else if (email) {
      this.showErrorToast('Please enter a valid email address');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  clearErrors() {
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
  }

  showSuccessToast(message) {
    console.log('✓', message);
  }

  showErrorToast(message) {
    console.log('✗', message);
  }

  showInfoToast(message) {
    console.log('ℹ', message);
  }

  navigateTo(view) {
    window.location.hash = `#${view}`;
  }
}
