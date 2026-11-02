const { LOCATION_DATA } = require('../config/locations');

/**
 * Controller for Authentication & Citizen Registration
 */

// Helper to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to validate 10-digit Indian mobile number
function isValidPhone(phone) {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
}

// Helper to validate 12-digit Aadhaar number
function isValidAadhaar(aadhaar) {
  const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(cleanAadhaar);
}

// Helper to validate 6-digit Indian PIN code
function isValidPinCode(pin) {
  const pinRegex = /^[1-9]\d{5}$/;
  return pinRegex.test(pin.trim());
}

// Helper to validate strong password
function isValidPassword(password) {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special symbol
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Render Citizen Registration Form
 * GET /register
 */
exports.getRegister = (req, res) => {
  res.render('pages/auth/register', {
    pageTitle: 'Citizen Registration | CivicFix',
    locationData: LOCATION_DATA,
    errors: {},
    formData: {}
  });
};

/**
 * Process Citizen Registration Submission
 * POST /register
 */
exports.postRegister = (req, res) => {
  const {
    fullName,
    phoneNumber,
    email,
    aadhaarNumber,
    state,
    district,
    localGovType,
    localBodyName,
    wardNumber,
    locality,
    pinCode,
    password,
    confirmPassword
  } = req.body;

  const errors = {};

  // 1. Personal Details Validation
  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = 'Please enter your full legal name (at least 3 characters).';
  }

  if (!phoneNumber || !isValidPhone(phoneNumber)) {
    errors.phoneNumber = 'Enter a valid 10-digit Indian mobile number (e.g., 9876543210).';
  }

  if (!email || !isValidEmail(email)) {
    errors.email = 'Enter a valid email address (e.g., name@example.com).';
  }

  if (!aadhaarNumber || !isValidAadhaar(aadhaarNumber)) {
    errors.aadhaarNumber = 'Enter a valid 12-digit Aadhaar number (e.g., 1234 5678 9012).';
  }

  // 2. Location Validation
  if (!state || !state.trim()) {
    errors.state = 'Please select your state.';
  }

  if (!district || !district.trim()) {
    errors.district = 'Please select your district.';
  }

  if (!localGovType || !['urban', 'rural'].includes(localGovType)) {
    errors.localGovType = 'Please select your local government type (Urban or Rural).';
  }

  if (!localBodyName || !localBodyName.trim()) {
    errors.localBodyName = 'Please select your Municipality / Corporation / Gram Panchayat.';
  }

  if (!wardNumber || !wardNumber.trim()) {
    errors.wardNumber = 'Please enter your Ward or Gram Sansad Number.';
  }

  if (!locality || !locality.trim()) {
    errors.locality = 'Please enter your Locality, Street, or Area name.';
  }

  if (!pinCode || !isValidPinCode(pinCode)) {
    errors.pinCode = 'Enter a valid 6-digit PIN code (e.g., 700001).';
  }

  // 3. Security Validation
  if (!password || !isValidPassword(password)) {
    errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // If errors exist, return status 422 with previous form inputs
  if (Object.keys(errors).length > 0) {
    return res.status(422).render('pages/auth/register', {
      pageTitle: 'Citizen Registration | CivicFix',
      locationData: LOCATION_DATA,
      errors,
      formData: {
        fullName,
        phoneNumber,
        email,
        aadhaarNumber,
        state,
        district,
        localGovType,
        localBodyName,
        wardNumber,
        locality,
        pinCode
      }
    });
  }

  // Clean Aadhaar format for safe display: e.g. XXXX-XXXX-1234
  const rawAadhaar = aadhaarNumber.replace(/[\s-]/g, '');
  const maskedAadhaar = `XXXX-XXXX-${rawAadhaar.slice(-4)}`;

  // Valid submission response
  res.status(200).render('pages/auth/register-success', {
    pageTitle: 'Registration Successful | CivicFix',
    citizen: {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim().toLowerCase(),
      maskedAadhaar,
      state,
      district,
      localGovType: localGovType === 'urban' ? 'Urban (Municipality / Corporation)' : 'Rural (Gram Panchayat)',
      localBodyName,
      wardNumber,
      locality,
      pinCode
    }
  });
};

/**
 * Render Citizen Login Form
 * GET /login
 */
exports.getLogin = (req, res) => {
  res.render('pages/auth/login', {
    pageTitle: 'Citizen Login | CivicFix',
    errors: {},
    formData: {}
  });
};

/**
 * Process Citizen Login Form
 * POST /login
 */
exports.postLogin = (req, res) => {
  const { phoneNumber, password } = req.body;
  const errors = {};

  if (!phoneNumber || !isValidPhone(phoneNumber)) {
    errors.phoneNumber = 'Enter a valid 10-digit registered phone number.';
  }

  if (!password || password.trim().length === 0) {
    errors.password = 'Please enter your password.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('pages/auth/login', {
      pageTitle: 'Citizen Login | CivicFix',
      errors,
      formData: { phoneNumber }
    });
  }

  // Note for Milestone 1-2: Real authentication with password hashing & DB sessions will activate in Milestone 6
  res.render('pages/auth/login', {
    pageTitle: 'Citizen Login | CivicFix',
    errors: {
      general: 'Demo Mode: Valid credentials received! Real session authentication will activate in Milestone 6 (Database & Authentication).'
    },
    formData: { phoneNumber }
  });
};
