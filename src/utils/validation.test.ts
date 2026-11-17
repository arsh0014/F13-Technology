import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  hasFormErrors,
  isValidBusinessEmail,
  type ContactFormValues,
} from './validation';

const VALID_INPUT: ContactFormValues = {
  fullName: 'Jordan Mercer',
  businessEmail: 'jordan@mercer-systems.com',
  companyName: 'Mercer Systems',
  serviceInterestedIn: 'IT Consulting & Digital Transformation',
  projectBudget: '$100k – $250k',
  projectDescription: 'We need to modernize our regional treasury platform across three business units.',
};

test('isValidBusinessEmail accepts standard emails and rejects malformed ones', () => {
  assert.equal(isValidBusinessEmail('alex@company.io'), true);
  assert.equal(isValidBusinessEmail('invalid-email'), false);
  assert.equal(isValidBusinessEmail('missing@domain'), false);
  assert.equal(isValidBusinessEmail(''), false);
});

test('validateContactForm passes for complete valid submission', () => {
  const errors = validateContactForm(VALID_INPUT);
  assert.equal(hasFormErrors(errors), false);
});

test('validateContactForm flags missing required fields without bypassing', () => {
  const errors = validateContactForm({
    fullName: '',
    businessEmail: 'not-an-email',
    companyName: '',
    serviceInterestedIn: '',
    projectBudget: '',
    projectDescription: 'Too short',
  });

  assert.equal(hasFormErrors(errors), true);
  assert.ok(errors.fullName);
  assert.ok(errors.businessEmail);
  assert.ok(errors.serviceInterestedIn);
  assert.ok(errors.projectBudget);
  assert.ok(errors.projectDescription);
});
