/**
 * SkillSwap Signup View
 * User registration and account creation
 */

export class SignupView {
  constructor(state) {
    this.state = state;
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.errors = {};
  }

  render() {
    return `
      <div class="signup-container">
        <div class="signup-card">
          <div class="signup-header">
            <h1>Join SkillSwap Today</h1>
            <p class="subtitle">Create your account and start exchanging skills</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
            </div>
            <p class="step-indicator">Step ${this.currentStep} of ${this.totalSteps}</p>
          </div>

          <form class="signup-form" id="signupForm">
            ${this.renderStepContent()}

            <div class="form-actions">
              ${this.currentStep > 1 ? '<button type="button" class="btn btn-secondary" id="prevBtn">← Back</button>' : ''}
              <button type="submit" class="btn btn-primary" id="nextBtn">
                ${this.currentStep === this.totalSteps ? 'Create Account' : 'Next →'}
              </button>
            </div>
          </form>

          <p class="login-prompt">
            Already have an account? 
            <a href="#" class="link-primary" id="loginLink">Sign in here</a>
          </p>
        </div>
      </div>
    `;
  }

  renderStepContent() {
    switch (this.currentStep) {
      case 1:
        return this.renderBasicInfoStep();
      case 2:
        return this.renderSkillsStep();
      case 3:
        return this.renderPreferencesStep();
      default:
        return '';
    }
  }

  renderBasicInfoStep() {
    return `
      <div class="step-content">
        <h2>Basic Information</h2>
        <p class="step-description">Tell us about yourself</p>

        <div class="form-group">
          <label for="firstName">First Name *</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName"
            placeholder="Enter your first name"
            value="${this.formData.firstName || ''}"
            class="form-control"
            required
          />
          ${this.getErrorHTML('firstName')}
        </div>

        <div class="form-group">
          <label for="lastName">Last Name *</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName"
            placeholder="Enter your last name"
            value="${this.formData.lastName || ''}"
            class="form-control"
            required
          />
          ${this.getErrorHTML('lastName')}
        </div>

        <div class="form-group">
          <label for="email">Email Address *</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            placeholder="Enter your email"
            value="${this.formData.email || ''}"
            class="form-control"
            required
          />
          ${this.getErrorHTML('email')}
        </div>

        <div class="form-group">
          <label for="password">Password *</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            placeholder="Create a strong password"
            class="form-control"
            required
          />
          <small class="form-text">At least 8 characters with uppercase, lowercase, and numbers</small>
          ${this.getErrorHTML('password')}
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password *</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword"
            placeholder="Confirm your password"
            class="form-control"
            required
          />
          ${this.getErrorHTML('confirmPassword')}
        </div>

        <div class="form-group">
          <label for="location">City/Location *</label>
          <input 
            type="text" 
            id="location" 
            name="location"
            placeholder="Where are you based? (e.g., Mumbai, India)"
            value="${this.formData.location || ''}"
            class="form-control"
            required
          />
          ${this.getErrorHTML('location')}
        </div>
      </div>
    `;
  }

  renderSkillsStep() {
    return `
      <div class="step-content">
        <h2>Your Skills</h2>
        <p class="step-description">What can you teach and what do you want to learn?</p>

        <div class="form-group">
          <label>Skills You Can Teach *</label>
          <div class="skills-input">
            <input 
              type="text" 
              id="teachSkillInput"
              placeholder="e.g., Guitar, Python, Digital Art"
              class="form-control"
            />
            <button type="button" class="btn btn-sm btn-secondary" id="addTeachSkillBtn">Add</button>
          </div>
          <div class="skills-list" id="teachSkillsList">
            ${this.renderSkillTags(this.formData.skillsTeach || [])}
          </div>
          ${this.getErrorHTML('skillsTeach')}
        </div>

        <div class="form-group">
          <label>Skills You Want to Learn *</label>
          <div class="skills-input">
            <input 
              type="text" 
              id="learnSkillInput"
              placeholder="e.g., Photography, Spanish, UI Design"
              class="form-control"
            />
            <button type="button" class="btn btn-sm btn-secondary" id="addLearnSkillBtn">Add</button>
          </div>
          <div class="skills-list" id="learnSkillsList">
            ${this.renderSkillTags(this.formData.skillsWant || [])}
          </div>
          ${this.getErrorHTML('skillsWant')}
        </div>

        <div class="form-group">
          <label for="bio">Bio / About You</label>
          <textarea 
            id="bio" 
            name="bio"
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            rows="4"
            class="form-control"
            maxlength="500"
          >${this.formData.bio || ''}</textarea>
          <small class="form-text">Max 500 characters</small>
        </div>
      </div>
    `;
  }

  renderPreferencesStep() {
    return `
      <div class="step-content">
        <h2>Preferences</h2>
        <p class="step-description">How do you prefer to exchange skills?</p>

        <div class="form-group">
          <label>Exchange Mode *</label>
          <div class="radio-group">
            <label class="radio-option">
              <input 
                type="radio" 
                name="mode" 
                value="online"
                ${this.formData.mode === 'online' ? 'checked' : ''}
              />
              <span class="radio-label">Online Only</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                name="mode" 
                value="inperson"
                ${this.formData.mode === 'inperson' ? 'checked' : ''}
              />
              <span class="radio-label">In-Person Only</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                name="mode" 
                value="both"
                ${this.formData.mode === 'both' ? 'checked' : ''}
              />
              <span class="radio-label">Both Online & In-Person</span>
            </label>
          </div>
          ${this.getErrorHTML('mode')}
        </div>

        <div class="form-group">
          <label>Availability *</label>
          <div class="checkbox-group">
            <label class="checkbox-option">
              <input 
                type="checkbox" 
                name="availability" 
                value="Weekdays"
                ${this.formData.availability?.includes('Weekdays') ? 'checked' : ''}
              />
              <span>Weekdays</span>
            </label>
            <label class="checkbox-option">
              <input 
                type="checkbox" 
                name="availability" 
                value="Weekends"
                ${this.formData.availability?.includes('Weekends') ? 'checked' : ''}
              />
              <span>Weekends</span>
            </label>
            <label class="checkbox-option">
              <input 
                type="checkbox" 
                name="availability" 
                value="Mornings"
                ${this.formData.availability?.includes('Mornings') ? 'checked' : ''}
              />
              <span>Mornings</span>
            </label>
            <label class="checkbox-option">
              <input 
                type="checkbox" 
                name="availability" 
                value="Evenings"
                ${this.formData.availability?.includes('Evenings') ? 'checked' : ''}
              />
              <span>Evenings</span>
            </label>
          </div>
          ${this.getErrorHTML('availability')}
        </div>

        <div class="form-group">
          <label for="languages">Languages You Speak *</label>
          <select id="languages" name="languages" multiple class="form-control">
            <option value="English" ${this.formData.languages?.includes('English') ? 'selected' : ''}>English</option>
            <option value="Hindi" ${this.formData.languages?.includes('Hindi') ? 'selected' : ''}>Hindi</option>
            <option value="Tamil" ${this.formData.languages?.includes('Tamil') ? 'selected' : ''}>Tamil</option>
            <option value="Telugu" ${this.formData.languages?.includes('Telugu') ? 'selected' : ''}>Telugu</option>
            <option value="Marathi" ${this.formData.languages?.includes('Marathi') ? 'selected' : ''}>Marathi</option>
            <option value="Gujarati" ${this.formData.languages?.includes('Gujarati') ? 'selected' : ''}>Gujarati</option>
            <option value="Kannada" ${this.formData.languages?.includes('Kannada') ? 'selected' : ''}>Kannada</option>
            <option value="Bengali" ${this.formData.languages?.includes('Bengali') ? 'selected' : ''}>Bengali</option>
          </select>
          <small class="form-text">Hold Ctrl/Cmd to select multiple</small>
          ${this.getErrorHTML('languages')}
        </div>

        <div class="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="termsAgree"
            name="termsAgree"
            ${this.formData.termsAgree ? 'checked' : ''}
            required
          />
          <label for="termsAgree" class="checkbox-label">
            I agree to the <a href="#" class="link-primary">Terms of Service</a> and 
            <a href="#" class="link-primary">Privacy Policy</a>
          </label>
          ${this.getErrorHTML('termsAgree')}
        </div>
      </div>
    `;
  }

  renderSkillTags(skills) {
    return skills.map(skill => `
      <span class="skill-tag">
        ${skill}
        <button type="button" class="tag-remove" data-skill="${skill}">&times;</button>
      </span>
    `).join('');
  }

  getErrorHTML(field) {
    return this.errors[field] ? `<span class="error-hint">${this.errors[field]}</span>` : '';
  }

  attachEventListeners() {
    const form = document.getElementById('signupForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const loginLink = document.getElementById('loginLink');

    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.validateAndProceed();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.previousStep();
      });
    }

    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('login');
      });
    }

    // Skill management
    if (this.currentStep === 2) {
      document.getElementById('addTeachSkillBtn')?.addEventListener('click', () => {
        const input = document.getElementById('teachSkillInput');
        if (input?.value) {
          this.addSkill(input.value, 'skillsTeach');
          input.value = '';
        }
      });

      document.getElementById('addLearnSkillBtn')?.addEventListener('click', () => {
        const input = document.getElementById('learnSkillInput');
        if (input?.value) {
          this.addSkill(input.value, 'skillsWant');
          input.value = '';
        }
      });

      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
          e.preventDefault();
          const skill = e.target.dataset.skill;
          const fieldName = e.target.closest('#teachSkillsList') ? 'skillsTeach' : 'skillsWant';
          this.removeSkill(skill, fieldName);
        }
      });
    }
  }

  addSkill(skill, fieldName) {
    if (!this.formData[fieldName]) {
      this.formData[fieldName] = [];
    }
    if (!this.formData[fieldName].includes(skill)) {
      this.formData[fieldName].push(skill);
      this.render();
      this.attachEventListeners();
    }
  }

  removeSkill(skill, fieldName) {
    this.formData[fieldName] = this.formData[fieldName].filter(s => s !== skill);
    this.render();
    this.attachEventListeners();
  }

  validateAndProceed() {
    this.errors = {};
    const isValid = this.validateStep(this.currentStep);

    if (isValid) {
      this.saveFormData();
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.render();
        this.attachEventListeners();
      } else {
        this.handleFormSubmit(new Event('submit'));
      }
    }
  }

  validateStep(step) {
    const validations = {
      1: () => this.validateBasicInfo(),
      2: () => this.validateSkills(),
      3: () => this.validatePreferences()
    };
    return validations[step]?.() || false;
  }

  validateBasicInfo() {
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const password = document.getElementById('password')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';
    const location = document.getElementById('location')?.value || '';

    if (!firstName) this.errors.firstName = 'First name is required';
    if (!lastName) this.errors.lastName = 'Last name is required';
    if (!email) this.errors.email = 'Email is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) this.errors.email = 'Invalid email format';
    if (!password) this.errors.password = 'Password is required';
    if (password && password.length < 8) this.errors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) this.errors.confirmPassword = 'Passwords do not match';
    if (!location) this.errors.location = 'Location is required';

    return Object.keys(this.errors).length === 0;
  }

  validateSkills() {
    const teachSkills = this.formData.skillsTeach || [];
    const learnSkills = this.formData.skillsWant || [];

    if (teachSkills.length === 0) this.errors.skillsTeach = 'Add at least one skill you can teach';
    if (learnSkills.length === 0) this.errors.skillsWant = 'Add at least one skill you want to learn';

    return Object.keys(this.errors).length === 0;
  }

  validatePreferences() {
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    const availability = document.querySelectorAll('input[name="availability"]:checked');
    const languages = document.getElementById('languages')?.selectedOptions.length;
    const termsAgree = document.getElementById('termsAgree')?.checked;

    if (!mode) this.errors.mode = 'Please select an exchange mode';
    if (availability.length === 0) this.errors.availability = 'Select at least one availability option';
    if (!languages) this.errors.languages = 'Select at least one language';
    if (!termsAgree) this.errors.termsAgree = 'You must agree to the terms';

    return Object.keys(this.errors).length === 0;
  }

  saveFormData() {
    this.formData.firstName = document.getElementById('firstName')?.value || '';
    this.formData.lastName = document.getElementById('lastName')?.value || '';
    this.formData.email = document.getElementById('email')?.value || '';
    this.formData.location = document.getElementById('location')?.value || '';
    this.formData.bio = document.getElementById('bio')?.value || '';
    this.formData.mode = document.querySelector('input[name="mode"]:checked')?.value;
    this.formData.availability = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
      .map(cb => cb.value);
    this.formData.languages = Array.from(document.getElementById('languages')?.selectedOptions || [])
      .map(option => option.value);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const newUser = {
      id: `user-${Date.now()}`,
      name: `${this.formData.firstName} ${this.formData.lastName}`,
      email: this.formData.email,
      password: document.getElementById('password')?.value || '',
      location: this.formData.location,
      bio: this.formData.bio,
      mode: this.formData.mode,
      availability: this.formData.availability,
      languages: this.formData.languages,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      online: true,
      verified: false,
      rating: 0,
      ratingCount: 0,
      completedExchanges: 0,
      teachingHours: 0,
      skillCredits: 3, // Welcome bonus
      streakDays: 0,
      exchangeScore: 50,
      skillsTeach: this.formData.skillsTeach?.map(name => ({
        name,
        category: 'Technology',
        level: 'Intermediate',
        description: ''
      })) || [],
      skillsWant: this.formData.skillsWant?.map(name => ({
        name,
        category: 'Technology',
        targetLevel: 'Intermediate',
        goal: ''
      })) || [],
      badges: [],
      progress: [],
      ratingsBreakdown: {},
      role: 'Member'
    };

    this.state.state.users.push(newUser);
    this.state.state.currentUserId = newUser.id;
    this.state.saveState();

    console.log('✓ Account created successfully!');
    this.showSuccessToast('Account created! Redirecting to dashboard...');
    setTimeout(() => this.navigateTo('dashboard'), 1500);
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.saveFormData();
      this.currentStep--;
      this.render();
      this.attachEventListeners();
    }
  }

  showSuccessToast(message) {
    console.log('✓', message);
  }

  navigateTo(view) {
    window.location.hash = `#${view}`;
  }
}
