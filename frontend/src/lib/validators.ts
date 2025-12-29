// T007: Input validation utilities

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

// Task title validation: Required, 1-200 characters
export function validateTaskTitle(title: string): ValidationResult {
  const trimmed = title.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Title is required' };
  }

  if (trimmed.length > 200) {
    return { isValid: false, error: 'Title must be 200 characters or less' };
  }

  return { isValid: true, error: null };
}

// Task description validation: Optional, max 1000 characters
export function validateTaskDescription(description: string | undefined): ValidationResult {
  if (!description) {
    return { isValid: true, error: null };
  }

  const trimmed = description.trim();

  if (trimmed.length > 1000) {
    return { isValid: false, error: 'Description must be 1000 characters or less' };
  }

  return { isValid: true, error: null };
}

// Email validation for login
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  // RFC 5321 max length
  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
}

// Password validation for login (basic - actual validation by Better Auth)
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  return { isValid: true, error: null };
}

// Password validation for signup (stricter)
export function validateSignupPassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  if (password.length > 100) {
    return { isValid: false, error: 'Password must be 100 characters or less' };
  }

  return { isValid: true, error: null };
}

// Name validation for signup
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Name is required' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Name must be 100 characters or less' };
  }

  return { isValid: true, error: null };
}

// Validate task create/update form
export interface TaskFormValidation {
  title: ValidationResult;
  description: ValidationResult;
  isValid: boolean;
}

export function validateTaskForm(title: string, description?: string): TaskFormValidation {
  const titleResult = validateTaskTitle(title);
  const descriptionResult = validateTaskDescription(description);

  return {
    title: titleResult,
    description: descriptionResult,
    isValid: titleResult.isValid && descriptionResult.isValid,
  };
}

// Validate login form
export interface LoginFormValidation {
  email: ValidationResult;
  password: ValidationResult;
  isValid: boolean;
}

export function validateLoginForm(email: string, password: string): LoginFormValidation {
  const emailResult = validateEmail(email);
  const passwordResult = validatePassword(password);

  return {
    email: emailResult,
    password: passwordResult,
    isValid: emailResult.isValid && passwordResult.isValid,
  };
}

// Validate signup form
export interface SignupFormValidation {
  name: ValidationResult;
  email: ValidationResult;
  password: ValidationResult;
  isValid: boolean;
}

export function validateSignupForm(name: string, email: string, password: string): SignupFormValidation {
  const nameResult = validateName(name);
  const emailResult = validateEmail(email);
  const passwordResult = validateSignupPassword(password);

  return {
    name: nameResult,
    email: emailResult,
    password: passwordResult,
    isValid: nameResult.isValid && emailResult.isValid && passwordResult.isValid,
  };
}
