# CivicFix — Daily Engineering & Learning Log

## Entry 1: Project Setup & Citizen Registration Implementation

### Date
2026-11-01

### What Was Built
1. **Repository Foundation:**
   - Initialized Git repository.
   - Configured `package.json` with scripts for `start` (`node src/server.js`) and `dev` (`nodemon src/server.js`).
   - Installed `express`, `ejs`, and `dotenv`.
   - Setup `.gitignore` and `.env.example`.

2. **Citizen Registration Page (`/register`):**
   - Engineered compact, single-column dark-themed card container (`#0b0d12` background, `#13161f` card, thin `#242938` grey borders).
   - Added all 13 mandatory fields:
     - Full Name
     - Phone Number (+91 prefix)
     - Email Address
     - Aadhaar Number (12 digits, formatted as XXXX XXXX XXXX)
     - State (Dropdown)
     - District (Dependent Dropdown)
     - Local Government Type (Urban vs. Rural radio pills)
     - Municipality / Corporation / Gram Panchayat (Dependent Dropdown)
     - Ward Number / Sansad
     - Locality / Area / Landmark
     - PIN Code (6 digits)
     - Password (with live strength meter)
     - Confirm Password (live equality check)
   - Single primary action button: **Register**.
   - Preserved Aadhaar data safely and displayed masked Aadhaar (`XXXX-XXXX-1234`) on confirmation.

3. **Separate Citizen Login Page (`/login`):**
   - Separate minimal dark-themed login card requiring only Phone Number and Password.

4. **Client-Side & Server-Side Validation:**
   - Client: `src/public/js/register-validation.js` with instant input masking, live regex validation, password policy strength scoring, and dependent dropdown cascading.
   - Server: `src/controllers/auth.controller.js` re-validating every untrusted input and returning HTTP 422 with preserved form values and field-specific errors if client validation is bypassed.

### Key Pedagogical Takeaways (For Beginners)
- **Why Both Client and Server Validation?**
  Browser validation provides immediate, friendly UX to the user without a network round-trip. However, malicious actors or tools like `curl` can bypass the browser completely. Hence, the Express server must *never* trust input and must always re-validate every field before processing.
- **How Dependent Dropdowns Work:**
  A hierarchical JavaScript data structure (`LOCATION_DATA`) maps States to Districts and Districts to Urban Municipalities or Rural Gram Panchayats. Listening to the `change` event on the parent dropdown clears and repopulates the `<option>` elements of the child dropdown.
- **Input Masking:**
  Using regular expressions with JavaScript `replace()` allows real-time formatting (e.g. inserting spaces into Aadhaar numbers or stripping non-digits from phone numbers) as the user types.
