// ============================================
// SIGNUP MULTI-STEP FORM LOGIC
// ============================================

let currentStep = 1;
const totalSteps = 3;
const form = document.getElementById('signup-form');

/**
 * Initialize the form on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  attachFormListeners();
  updateProgressUI();
});

/**
 * Attach event listeners to form inputs
 */
function attachFormListeners() {
  // Allow Enter key to continue on Step 1
  const step1Inputs = document.querySelectorAll('section[data-step="1"] input');
  step1Inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextStep();
      }
    });
  });

  // Form submission
  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Navigate to the next step
 */
function nextStep() {
  if (validateCurrentStep()) {
    currentStep++;
    updateProgressUI();
  }
}

/**
 * Navigate to the previous step
 */
function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    updateProgressUI();
  }
}

/**
 * Validate the current step's required fields
 */
function validateCurrentStep() {
  const currentStepSection = document.querySelector(`section[data-step="${currentStep}"]`);
  let isValid = true;

  // Get all required inputs in this step
  const requiredFields = currentStepSection.querySelectorAll('[required]');
  const radioGroups = currentStepSection.querySelectorAll('input[type="radio"][required]');

  // Check text inputs, emails, numbers, selects
  requiredFields.forEach(field => {
    const errorDisplay = field.parentElement.querySelector('.error-message');
    const value = field.value.trim();

    if (value === '' || value === 0) {
      isValid = false;
      if (field.type === 'email') {
        showFieldError(field, 'Please enter a valid email address');
      } else if (field.type === 'password') {
        showFieldError(field, 'Password is required');
      } else if (field.type === 'number') {
        showFieldError(field, `${field.placeholder || field.name} is required`);
      } else {
        showFieldError(field, 'This field is required');
      }
    } else {
      clearFieldError(field);
    }

    // Additional validation for specific fields
    if (field.id === 'password' && value.length < 6) {
      showFieldError(field, 'Password must be at least 6 characters');
      isValid = false;
    }
  });

  // Check if at least one radio button is selected in groups marked as required
  if (currentStep === 2) {
    const healthGoalChecked = document.querySelector('input[name="health-goal"]:checked');
    if (!healthGoalChecked) {
      const errorDisplay = document.querySelector('section[data-step="2"] .form-group:first-child .error-message');
      if (errorDisplay) {
        errorDisplay.textContent = 'Please select a health goal';
        errorDisplay.style.display = 'block';
      }
      isValid = false;
    }
  }

  if (currentStep === 3) {
    const activityLevelChecked = document.querySelector('input[name="activity-level"]:checked');
    if (!activityLevelChecked) {
      // Find the activity level error message
      const step3Section = document.querySelector('section[data-step="3"]');
      const activityGroup = Array.from(step3Section.querySelectorAll('.form-group')).find(
        group => group.querySelector('input[name="activity-level"]')
      );
      if (activityGroup) {
        const errorDisplay = activityGroup.querySelector('.error-message');
        if (errorDisplay) {
          errorDisplay.textContent = 'Please select your activity level';
          errorDisplay.style.display = 'block';
        }
      }
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Display error message for a field
 */
function showFieldError(field, message) {
  field.classList.add('error');
  const errorDisplay = field.parentElement.querySelector('.error-message');
  if (errorDisplay) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
  }
}

/**
 * Clear error message for a field
 */
function clearFieldError(field) {
  field.classList.remove('error');
  const errorDisplay = field.parentElement.querySelector('.error-message');
  if (errorDisplay) {
    errorDisplay.textContent = '';
    errorDisplay.style.display = 'none';
  }
}

/**
 * Update the UI to show the current step
 */
function updateProgressUI() {
  // Hide all steps
  document.querySelectorAll('.signup-step').forEach(step => {
    step.hidden = true;
    step.classList.remove('active');
  });

  // Show current step
  const currentStepElement = document.querySelector(`section[data-step="${currentStep}"]`);
  if (currentStepElement) {
    currentStepElement.hidden = false;
    currentStepElement.classList.add('active');
  }

  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  const progressPercent = (currentStep / totalSteps) * 100;
  progressFill.style.width = progressPercent + '%';

  // Update progress indicators
  document.querySelectorAll('.progress-step').forEach((step, index) => {
    if (index + 1 <= currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // Scroll to top of form
  currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  // Collect form data
  const formData = {
    // Step 1: Basic Info
    fullName: document.getElementById('full-name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    country: document.getElementById('country').value.trim(),

    // Step 2: Health Profile
    healthGoal: document.querySelector('input[name="health-goal"]:checked')?.value || '',
    healthConditions: Array.from(document.querySelectorAll('input[name="health-condition"]:checked'))
      .map(input => input.value),
    dietaryPreferences: Array.from(document.querySelectorAll('input[name="dietary-pref"]:checked'))
      .map(input => input.value),
    allergies: Array.from(document.querySelectorAll('input[name="allergy"]:checked'))
      .map(input => input.value),

    // Step 3: Lifestyle & Personalization
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    weight: document.getElementById('weight').value,
    height: document.getElementById('height').value,
    activityLevel: document.querySelector('input[name="activity-level"]:checked')?.value || '',
    wantsMealPlan: document.getElementById('meal-plan-preference').checked,
    timestamp: new Date().toISOString(),
  };

  console.log('Form Data:', formData);

  // Send to backend or local storage
  submitSignupForm(formData);
}

/**
 * Submit the signup form data
 */
function submitSignupForm(formData) {
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Creating Account...';

  // Simulate API call or send to your backend
  setTimeout(() => {
    // In production, you would send this to your backend
    console.log('Submitting form data:', formData);

    // Store in sessionStorage for now (can be replaced with API call)
    sessionStorage.setItem('signupFormData', JSON.stringify(formData));

    // Show success message or redirect
    handleSignupSuccess(formData);

    // Reset button
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }, 1500);
}

/**
 * Handle successful form submission
 */
function handleSignupSuccess(formData) {
  // Show success modal or redirect to confirmation page
  alert(`Account creation successful for ${formData.fullName}!\n\nYou can now log in with your email.`);

  // Redirect to login or dashboard
  // For now, just reset the form
  form.reset();
  currentStep = 1;
  updateProgressUI();

  // In production, redirect to:
  // window.location.href = '/dashboard.html';
  // or window.location.href = '/verify-email.html';
}

/**
 * Real-time field validation
 */
document.addEventListener('change', (e) => {
  if (e.target.type === 'email') {
    const email = e.target.value.trim();
    if (email && !isValidEmail(email)) {
      showFieldError(e.target, 'Please enter a valid email address');
    } else {
      clearFieldError(e.target);
    }
  }

  if (e.target.type === 'number') {
    if (e.target.value && e.target.value <= 0) {
      showFieldError(e.target, 'Please enter a valid value');
    } else {
      clearFieldError(e.target);
    }
  }
});

/**
 * Email validation helper
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password strength indicator (optional enhancement)
 */
function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  return strength;
}
