/**
 * CivicFix - Citizen Registration Client-Side Validation & Dynamic Dropdowns
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  // Form Field Elements
  const fullName = document.getElementById('fullName');
  const phoneNumber = document.getElementById('phoneNumber');
  const email = document.getElementById('email');
  const aadhaarNumber = document.getElementById('aadhaarNumber');
  const state = document.getElementById('state');
  const district = document.getElementById('district');
  const govTypeUrban = document.getElementById('govTypeUrban');
  const govTypeRural = document.getElementById('govTypeRural');
  const localBodyLabel = document.getElementById('localBodyLabel');
  const localBodyName = document.getElementById('localBodyName');
  const wardNumber = document.getElementById('wardNumber');
  const locality = document.getElementById('locality');
  const pinCode = document.getElementById('pinCode');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const meterFill = document.getElementById('meterFill');
  const meterText = document.getElementById('meterText');
  const submitBtn = document.getElementById('submitRegisterBtn');

  // Master Location Data from Server
  const locations = window.CIVICFIX_LOCATIONS || {};
  const prevValues = window.CIVICFIX_PREVIOUS_VALUES || {};

  // =========================================================================
  // 1. DYNAMIC DEPENDENT LOCATION DROPDOWNS
  // =========================================================================

  function getSelectedGovType() {
    return govTypeRural && govTypeRural.checked ? 'rural' : 'urban';
  }

  function updateDistricts(selectedState, preselectedDistrict) {
    district.innerHTML = '<option value="">-- Select District --</option>';
    localBodyName.innerHTML = '<option value="">-- Select District First --</option>';

    if (!selectedState || !locations[selectedState]) {
      district.disabled = true;
      localBodyName.disabled = true;
      return;
    }

    district.disabled = false;
    const districtsObj = locations[selectedState].districts || {};
    
    Object.keys(districtsObj).forEach(distName => {
      const option = document.createElement('option');
      option.value = distName;
      option.textContent = distName;
      if (preselectedDistrict && preselectedDistrict === distName) {
        option.selected = true;
      }
      district.appendChild(option);
    });

    if (preselectedDistrict && districtsObj[preselectedDistrict]) {
      updateLocalBodies(selectedState, preselectedDistrict, getSelectedGovType(), prevValues.localBodyName);
    }
  }

  function updateLocalBodies(selectedState, selectedDistrict, govType, preselectedBody) {
    localBodyName.innerHTML = '';
    
    // Update Label dynamically based on Urban vs Rural
    if (govType === 'urban') {
      localBodyLabel.innerHTML = 'Municipality / Corporation <span class="required-star">*</span>';
      localBodyName.innerHTML = '<option value="">-- Select Municipality / Corporation --</option>';
    } else {
      localBodyLabel.innerHTML = 'Gram Panchayat <span class="required-star">*</span>';
      localBodyName.innerHTML = '<option value="">-- Select Gram Panchayat --</option>';
    }

    if (!selectedState || !selectedDistrict || !locations[selectedState] || !locations[selectedState].districts[selectedDistrict]) {
      localBodyName.disabled = true;
      return;
    }

    localBodyName.disabled = false;
    const districtData = locations[selectedState].districts[selectedDistrict];
    const bodiesList = districtData[govType] || [];

    if (bodiesList.length === 0) {
      const emptyOpt = document.createElement('option');
      emptyOpt.value = "";
      emptyOpt.textContent = `No ${govType === 'urban' ? 'Municipalities' : 'Panchayats'} listed for this district`;
      localBodyName.appendChild(emptyOpt);
      return;
    }

    bodiesList.forEach(body => {
      const opt = document.createElement('option');
      opt.value = body;
      opt.textContent = body;
      if (preselectedBody && preselectedBody === body) {
        opt.selected = true;
      }
      localBodyName.appendChild(opt);
    });
  }

  // Event Listeners for Location Change
  state.addEventListener('change', () => {
    updateDistricts(state.value, null);
    validateField(state, state.value.trim() !== '', 'Please select your state.');
  });

  district.addEventListener('change', () => {
    updateLocalBodies(state.value, district.value, getSelectedGovType(), null);
    validateField(district, district.value.trim() !== '', 'Please select your district.');
  });

  const onGovTypeChange = () => {
    updateLocalBodies(state.value, district.value, getSelectedGovType(), null);
  };

  if (govTypeUrban) govTypeUrban.addEventListener('change', onGovTypeChange);
  if (govTypeRural) govTypeRural.addEventListener('change', onGovTypeChange);

  // Initialize previous location state if re-rendered with validation errors
  if (state.value) {
    updateDistricts(state.value, prevValues.district);
  }

  // =========================================================================
  // 2. INPUT FORMATTING & MASKS
  // =========================================================================

  // Phone input: numeric only, max 10
  phoneNumber.addEventListener('input', (e) => {
    let clean = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = clean;
    validatePhone();
  });

  // Aadhaar input: format as 1234 5678 9012
  aadhaarNumber.addEventListener('input', (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    let parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.substring(i, i + 4));
    }
    e.target.value = parts.join(' ');
    validateAadhaar();
  });

  // PIN code: numeric only, max 6
  pinCode.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    validatePinCode();
  });

  // =========================================================================
  // 3. FIELD-LEVEL VALIDATION HELPERS
  // =========================================================================

  function setError(field, errorElementId, message) {
    field.classList.add('input-error');
    const errSpan = document.getElementById(errorElementId);
    if (errSpan) errSpan.textContent = message;
    return false;
  }

  function clearError(field, errorElementId) {
    field.classList.remove('input-error');
    const errSpan = document.getElementById(errorElementId);
    if (errSpan) errSpan.textContent = '';
    return true;
  }

  function validateField(field, condition, message) {
    const errorId = field.id + 'Error';
    if (!condition) {
      return setError(field, errorId, message);
    }
    return clearError(field, errorId);
  }

  function validateFullName() {
    const val = fullName.value.trim();
    return validateField(fullName, val.length >= 3, 'Full name must be at least 3 characters.');
  }

  function validatePhone() {
    const val = phoneNumber.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    return validateField(phoneNumber, phoneRegex.test(val), 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
  }

  function validateEmail() {
    const val = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validateField(email, emailRegex.test(val), 'Enter a valid email address (e.g. citizen@example.com).');
  }

  function validateAadhaar() {
    const clean = aadhaarNumber.value.replace(/\s/g, '');
    return validateField(aadhaarNumber, /^\d{12}$/.test(clean), 'Aadhaar must be exactly 12 numeric digits.');
  }

  function validatePinCode() {
    const val = pinCode.value.trim();
    return validateField(pinCode, /^[1-9]\d{5}$/.test(val), 'Enter a valid 6-digit Indian PIN code.');
  }

  function evaluatePasswordStrength(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val)) score++;

    if (val.length === 0) {
      meterFill.style.width = '0%';
      meterFill.style.backgroundColor = 'transparent';
      meterText.textContent = 'Password strength';
      meterText.style.color = '#64748b';
      return score;
    }

    if (score <= 2) {
      meterFill.style.width = '33%';
      meterFill.style.backgroundColor = '#ef4444';
      meterText.textContent = 'Weak';
      meterText.style.color = '#f87171';
    } else if (score === 3 || score === 4) {
      meterFill.style.width = '66%';
      meterFill.style.backgroundColor = '#f59e0b';
      meterText.textContent = 'Moderate';
      meterText.style.color = '#fbbf24';
    } else if (score >= 5) {
      meterFill.style.width = '100%';
      meterFill.style.backgroundColor = '#10b981';
      meterText.textContent = 'Strong (Meets all policy rules)';
      meterText.style.color = '#34d399';
    }

    return score;
  }

  function validatePassword() {
    const val = password.value;
    const score = evaluatePasswordStrength(val);
    const isValid = score >= 5;
    return validateField(password, isValid, 'Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.');
  }

  function validateConfirmPassword() {
    const match = confirmPassword.value.length > 0 && confirmPassword.value === password.value;
    return validateField(confirmPassword, match, 'Passwords do not match.');
  }

  // Real-time Event Listeners for blur and input
  fullName.addEventListener('blur', validateFullName);
  email.addEventListener('blur', validateEmail);
  wardNumber.addEventListener('blur', () => validateField(wardNumber, wardNumber.value.trim() !== '', 'Ward or Sansad number is required.'));
  locality.addEventListener('blur', () => validateField(locality, locality.value.trim() !== '', 'Locality / Area is required.'));
  localBodyName.addEventListener('change', () => validateField(localBodyName, localBodyName.value.trim() !== '', 'Please select your local administrative body.'));

  password.addEventListener('input', () => {
    validatePassword();
    if (confirmPassword.value.length > 0) {
      validateConfirmPassword();
    }
  });

  confirmPassword.addEventListener('input', validateConfirmPassword);

  // =========================================================================
  // 4. SUBMIT EVENT HANDLER
  // =========================================================================

  form.addEventListener('submit', (e) => {
    const isNameValid = validateFullName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    const isAadhaarValid = validateAadhaar();
    const isStateValid = validateField(state, state.value.trim() !== '', 'Please select your state.');
    const isDistrictValid = validateField(district, district.value.trim() !== '', 'Please select your district.');
    const isBodyValid = validateField(localBodyName, localBodyName.value.trim() !== '', 'Please select your local administrative body.');
    const isWardValid = validateField(wardNumber, wardNumber.value.trim() !== '', 'Ward or Sansad number is required.');
    const isLocalityValid = validateField(locality, locality.value.trim() !== '', 'Locality / Area is required.');
    const isPinValid = validatePinCode();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    const isFormValid = isNameValid && isPhoneValid && isEmailValid && isAadhaarValid &&
                        isStateValid && isDistrictValid && isBodyValid && isWardValid &&
                        isLocalityValid && isPinValid && isPassValid && isConfirmValid;

    if (!isFormValid) {
      e.preventDefault();
      // Scroll to the first element with error
      const firstError = form.querySelector('.input-error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Valid submission: give visual feedback on button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering Account...';
    }
  });
});
