# License Key Fix - Complete Solution

## Problem Identified

The "License has expired" error was caused by **date format mismatch**:

1. **License Generator** creates hash using `DD/MM/YYYY` format
2. **Setup Wizard** was using HTML Date input which stores as `YYYY-MM-DD`
3. **Verification** failed because the formats didn't match

## Solution Applied

### 1. Updated Date Parsing (`src/utils/licenseVerification.ts`)
- Now handles multiple date formats: `DD/MM/YYYY`, `YYYY-MM-DD`, and Date objects
- More robust error handling

### 2. Updated Setup Instance (`src/setup/setupInstance.ts`)
- Converts Date objects to `DD/MM/YYYY` format before verification
- Ensures consistent format between generation and verification

### 3. Updated Setup Wizard Schema (`schemas/app/SetupWizard.json`)
- Changed `licenseExpiryDate` from `Date` field to `Data` field
- Users now enter date as text in `DD/MM/YYYY` format directly
- This matches the license generator format

---

## Working License Key for herry

**Use these exact values during setup:**

```
Company Name:    herry
Email:           herry@gmail.com
License Key:     F537A0353404484AB54759D25212C61B
Expiry Date:     31/12/2027
```

**Important:** Enter the expiry date as `31/12/2027` (DD/MM/YYYY format)

---

## How to Generate New License Keys

Use the license generator script:

```bash
node license_generator.js
```

To customize, edit `license_generator.js`:

```javascript
const companyName = 'Your Company';
const email = 'email@example.com';
const expiryDate = '31/12/2027';  // Must be DD/MM/YYYY format
```

---

## Testing the Fix

1. **Rebuild the application:**
   ```bash
   yarn build
   ```

2. **Run the application**

3. **During setup, enter:**
   - Company Name: herry
   - Email: herry@gmail.com  
   - License Key: F537A0353404484AB54759D25212C61B
   - License Expiry Date: 31/12/2027

4. **License should validate successfully!**

---

## Files Modified

1. `src/utils/licenseVerification.ts` - Enhanced date parsing
2. `src/setup/setupInstance.ts` - Date format conversion
3. `schemas/app/SetupWizard.json` - Changed field type
4. `license_generator.js` - Working license generator

---

## Technical Details

### License Generation Algorithm

```javascript
// 1. Sanitize company name (remove spaces)
sanitizedName = companyName.replace(/\s+/g, '')

// 2. Create payload
payload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${secretKey}`

// 3. Generate SHA-256 hash
hash = SHA256(payload)

// 4. Take first 32 characters, uppercase
licenseKey = hash.substring(0, 32).toUpperCase()
```

### Secret Key

The secret key is constructed from 5 obfuscated parts:
- Part 1: `WHo5JG1LcDJAdlFyNCFuTA==`
- Part 2: `NyNXc0VhNiZ1SW8zKlNkRg==`
- Part 3: `OF5HaEo1KHRZYk45KVJlVg==`
- Part 4: `MSVNakxjNH5QaU83YFp4Vw==`
- Part 5: `M3xBa1FzNj9IZkQyW21Kbg==`
- Suffix: `@#$%^`

Total length: 125 characters

---

## Troubleshooting

### Still getting "License has expired"?

1. **Check the date format** - Must be `DD/MM/YYYY`
2. **Check system date** - Make sure your computer's date is correct
3. **Rebuild the app** - Changes need to be compiled
4. **Clear browser cache** - If using web version

### License key doesn't match?

1. **Exact company name** - Must match exactly (case-insensitive)
2. **Exact email** - Must match exactly (case-insensitive)
3. **Exact expiry date** - Must match the format used in generation

---

## Contact

For license issues, check:
- `LICENSE_INSTRUCTIONS.txt` - Detailed instructions
- `debug_license.js` - Debug script for testing
- `license_generator.js` - Generate new licenses
