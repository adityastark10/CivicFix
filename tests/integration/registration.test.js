const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../src/app');

describe('CivicFix Registration & Auth Integration Tests', () => {

  test('GET / should return 200 OK and display landing page', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.text, /CivicFix/);
    assert.match(res.text, /Citizen Registration/);
  });

  test('GET /register should return 200 OK and display citizen registration form', async () => {
    const res = await request(app).get('/register');
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.text, /Citizen Registration/);
    assert.match(res.text, /Full Name/);
    assert.match(res.text, /Aadhaar Number/);
    assert.match(res.text, /Password/);
    assert.match(res.text, /Register/);
  });

  test('POST /register with empty body should return 422 and validation errors', async () => {
    const res = await request(app)
      .post('/register')
      .type('form')
      .send({});

    assert.strictEqual(res.statusCode, 422);
    assert.match(res.text, /Please enter your full legal name/);
    assert.match(res.text, /Enter a valid 10-digit Indian mobile number/);
    assert.match(res.text, /Enter a valid 12-digit Aadhaar number/);
    assert.match(res.text, /Please select your state/);
  });

  test('POST /register with valid citizen details should return 200 and success confirmation', async () => {
    const res = await request(app)
      .post('/register')
      .type('form')
      .send({
        fullName: 'Rahul Sen',
        phoneNumber: '9830112233',
        email: 'rahul.sen@example.com',
        aadhaarNumber: '1234 5678 9012',
        state: 'West Bengal',
        district: 'Kolkata',
        localGovType: 'urban',
        localBodyName: 'Kolkata Municipal Corporation (KMC)',
        wardNumber: '64',
        locality: 'Park Circus',
        pinCode: '700017',
        password: 'PassWord@123',
        confirmPassword: 'PassWord@123'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.match(res.text, /Registration Successful/);
    assert.match(res.text, /Rahul Sen/);
    assert.match(res.text, /XXXX-XXXX-9012/);
    assert.match(res.text, /Kolkata Municipal Corporation \(KMC\)/);
  });

  test('GET /login should return 200 and display login form', async () => {
    const res = await request(app).get('/login');
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.text, /Citizen Login/);
    assert.match(res.text, /Phone Number/);
    assert.match(res.text, /Password/);
  });

  test('POST /login with missing phone should return 422', async () => {
    const res = await request(app)
      .post('/login')
      .type('form')
      .send({
        phoneNumber: '',
        password: 'Password@123'
      });

    assert.strictEqual(res.statusCode, 422);
    assert.match(res.text, /Enter a valid 10-digit registered phone number/);
  });

});
