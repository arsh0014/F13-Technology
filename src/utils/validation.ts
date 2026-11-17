export interface ContactFormValues {
  fullName: string;
  businessEmail: string;
  companyName: string;
  serviceInterestedIn: string;
  projectBudget: string;
  projectDescription: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidBusinessEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  if (!values.businessEmail.trim()) {
    errors.businessEmail = 'Please enter your business email address.';
  } else if (!isValidBusinessEmail(values.businessEmail)) {
    errors.businessEmail = 'Please enter a valid email address (e.g. name@company.com).';
  }

  if (!values.serviceInterestedIn.trim()) {
    errors.serviceInterestedIn = 'Please select a service or area of interest.';
  }

  if (!values.projectBudget.trim()) {
    errors.projectBudget = 'Please select an estimated project budget.';
  }

  if (!values.projectDescription.trim() || values.projectDescription.trim().length < 15) {
    errors.projectDescription = 'Please share a brief description of your challenge (at least 15 characters).';
  }

  return errors;
}

export function hasFormErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
