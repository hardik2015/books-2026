# Licensing System Design Document

## Overview
This document describes the licensing system implementation for the Books-2026 application. The system provides license key generation, validation, and expiry checking functionality with advanced obfuscation techniques to prevent unauthorized use.

## Components

### 1. License Verification Module
**File:** `src/utils/licenseVerification.ts`

#### Interfaces
- `CompanyInfo`: Contains company information for license binding
  - `companyName`: String - Name of the company (spaces are removed during processing)
  - `email`: String - Company email address
  - `expiryDate`: String - License expiry date in DD/MM/YYYY format

- `LicenseVerificationResult`: Result of license verification
  - `isValid`: Boolean - Whether the license is valid
  - `message`: Optional string - Success message
  - `error`: Optional string - Error message if validation failed
  - `boundCompany`: Optional string - Name of the bound company

#### Functions

##### `generateLicenseKey(companyInfo: CompanyInfo)`
- **Purpose**: Generates a license key based on company information
- **Process**:
  1. Removes all spaces from the company name
  2. Creates a data string: `sanitizedCompanyName|email|expiryDate|secretKey`
  3. Generates a SHA-256 hash of the data
  4. Returns the first 32 characters of the uppercase hash
- **Returns**: Promise<string> - The generated license key

##### `verifyLicenseKey(licenseKey: string, companyInfo?: CompanyInfo)`
- **Purpose**: Verifies a license key against company information
- **Process**:
  1. Checks if license key is provided and not empty
  2. Checks if company info is provided
  3. Validates if the license has expired using `checkLicenseExpiry`
  4. Generates expected license key using `generateLicenseKey`
  5. Compares the provided key with the expected key (case-insensitive)
- **Returns**: Promise<LicenseVerificationResult>

##### `createCompanyBindingHash(companyInfo: CompanyInfo)`
- **Purpose**: Creates a hash for license binding verification
- **Process**: Similar to `generateLicenseKey` but used for binding verification
- **Returns**: Promise<string>

##### `checkLicenseExpiry(expiryDateString: string)`
- **Purpose**: Checks if a license has expired
- **Process**:
  1. Parses the expiry date string in DD/MM/YYYY format
  2. Compares with current date
  3. Returns true if expired, false otherwise
- **Returns**: Boolean

### 2. Secret Key Management
**File:** `src/utils/secretParts.ts`

#### Obfuscation Strategy
The secret key is split into 5 parts that are individually obfuscated using XOR encryption:

1. Each part is XOR-encrypted with a unique key
2. The encrypted result is base64 encoded
3. At runtime, parts are decrypted and combined to form the complete secret key

#### Constants
- `SECRET_PART_1` to `SECRET_PART_5`: Decrypted secret key components
- `SPECIAL_CHARS_CODES`: ASCII codes [64, 35, 36, 37, 94] representing "@#$%^"

#### Functions
- `obfuscatePart(part: string, key: string)`: XOR encrypts a string with a key
- `deobfuscatePart(obfuscatedPart: string, key: string)`: XOR decrypts a string with a key

### 3. Main Secret Key Construction
**File:** `src/utils/licenseVerification.ts`

#### `SECRET_LICENSE_KEY` Constant
- **Construction**: Combines all 5 secret parts + special characters
- **Runtime Protection**: Includes debugging detection that returns a fake key when debugging tools are detected
- **Access**: Through the `getSecretKey()` function

#### `getSecretKey(): string`
- **Purpose**: Returns the secret key with runtime protection
- **Process**: Detects debugging attempts and returns a fake key if detected

### 4. UI Integration
**Files:**
- `schemas/app/SetupWizard.json` - Defines UI fields
- `src/setup/types.ts` - Defines TypeScript interfaces
- `src/setup/setupInstance.ts` - Handles setup logic
- `schemas/core/SystemSettings.json` - Stores system settings

#### UI Fields
- `licenseKey`: Data field for entering the license key
- `licenseExpiryDate`: Date field for license expiry (DD/MM/YYYY format)

#### Setup Process
1. User enters company information including license key and expiry date
2. System verifies the license key using `verifyLicenseKey`
3. If valid, stores license information in SystemSettings
4. Binds company information to the license

#### Stored System Settings
- `licenseKey`: The entered license key (read-only)
- `boundCompanyName`: Company name bound to the license (read-only)
- `boundLicenseExpiryDate`: Expiry date bound to the license (read-only)
- `licenseBound`: Boolean flag indicating if license is bound (read-only)

## Security Features

### 1. Multi-Layer Obfuscation
- Base64 encoding of secret parts
- XOR encryption of each part with unique keys
- Runtime assembly of the secret key
- Debugging detection with fake key return

### 2. Decentralized Storage
- Secret parts stored in separate file (`secretParts.ts`)
- Import mechanism separates logic from data
- Multiple files involved in the process

### 3. Input Sanitization
- Spaces removed from company names during processing
- Case-insensitive comparisons
- Proper date format validation

### 4. Expiration Checking
- License expiry dates stored and validated
- Automatic rejection of expired licenses
- Date format enforcement (DD/MM/YYYY)

## Flow Diagram

```
User enters license info
         ↓
Verify license key format
         ↓
Parse expiry date (DD/MM/YYYY)
         ↓
Check if license has expired
         ↓
Generate expected key from company info
         ↓
Compare with entered key
         ↓
Store in SystemSettings if valid
```

## Files Summary

| File | Purpose |
|------|---------|
| `src/utils/licenseVerification.ts` | Core license logic, key generation/validation |
| `src/utils/secretParts.ts` | Secure storage of obfuscated secret key parts |
| `schemas/app/SetupWizard.json` | UI schema for license fields |
| `src/setup/types.ts` | Type definitions |
| `src/setup/setupInstance.ts` | Setup workflow integration |
| `schemas/core/SystemSettings.json` | System settings schema |

## Maintenance Notes

### Adding New Security Layers
- Modify `secretParts.ts` to add additional obfuscation
- Update `deobfuscatePart` function if changing algorithm
- Ensure all parts remain decentralized

### Changing Secret Key
- Update the values in `secretParts.ts`
- Maintain the XOR obfuscation for each part
- Regenerate obfuscated values using the obfuscation script

### Modifying Expiry Logic
- Update `checkLicenseExpiry` function as needed
- Consider time zones in date comparisons
- Update UI validation if format changes

### Updating UI Fields
- Modify `SetupWizard.json` to change field properties
- Update `SetupWizardOptions` interface in `types.ts`
- Adjust setup workflow in `setupInstance.ts` if needed

## Testing Considerations

- Unit tests should mock the secret key for predictable results
- Test expiry date validation with various date formats
- Verify that debugging detection works in different environments
- Test with various company name formats (with/without spaces)