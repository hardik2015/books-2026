import { showDialog } from './interactive';
import {
  SECRET_PART_1,
  SECRET_PART_2,
  SECRET_PART_3,
  SECRET_PART_4,
  SECRET_PART_5,
  SPECIAL_CHARS_CODES
} from './secretParts';

export interface CompanyInfo {
  companyName: string;
  email: string;
  expiryDate: string; // Expiry date in DD/MM/YYYY format
}

export interface LicenseVerificationResult {
  isValid: boolean;
  message?: string;
  error?: string;
  boundCompany?: string;
}

// Helper function to decode base64 in both browser and Node.js environments
function decodeBase64(encodedStr: string): string {
  // Handle both browser and Node.js environments
  if (typeof atob !== 'undefined') {
    // Browser environment
    return atob(encodedStr);
  } else {
    // Node.js environment - dynamically import Buffer if needed
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(encodedStr, 'base64').toString('utf8');
    } else {
      // Fallback using node:buffer
      const { Buffer } = require('buffer');
      return Buffer.from(encodedStr, 'base64').toString('utf8');
    }
  }
}

// Obfuscated secret key construction to make reverse engineering harder
// The key is split into parts and recombined at runtime
const SECRET_LICENSE_KEY = (() => {
  // Split the secret key into multiple parts to make it harder to extract
  // Base64 encoded parts for additional obfuscation (stored separately for security)
  const part1 = decodeBase64(SECRET_PART_1);
  const part2 = decodeBase64(SECRET_PART_2);
  const part3 = decodeBase64(SECRET_PART_3);
  const part4 = decodeBase64(SECRET_PART_4);
  const part5 = decodeBase64(SECRET_PART_5);

  // Additional obfuscation: use character codes to represent some characters
  const specialChars = String.fromCharCode(...SPECIAL_CHARS_CODES); // "@#$%^" in ASCII

  // Combine all parts to form the complete secret key
  return part1 + part2 + part3 + part4 + part5 + specialChars;
})();

/**
 * Generate a simple hash of a string (browser-compatible)
 */
async function simpleHash(input: string): Promise<string> {
  // Use Web Crypto API if available (browser environment)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for Node.js environment
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}

/**
 * Obfuscated function to get the secret key with additional runtime checks
 * This makes it harder to statically analyze the key
 */
function getSecretKey(): string {
  // Runtime checks to make debugging more difficult
  const isDebugging = typeof window !== 'undefined' &&
    (window.location.href.includes('debug') ||
     window.location.href.includes('inspect') ||
     window.location.href.includes('devtools'));

  if (isDebugging) {
    // Return a fake key if debugging is detected
    return 'fake-key-for-debugging-environment';
  }

  // Return the actual key
  return SECRET_LICENSE_KEY;
}

/**
 * Generate a license key based on company information
 * @param companyInfo - Company information to bind to the license
 * @returns Generated license key
 */
export async function generateLicenseKey(companyInfo: CompanyInfo): Promise<string> {
  // Remove spaces from company name before generating license key
  const sanitizedName = companyInfo.companyName.replace(/\s+/g, '');
  const secretKey = getSecretKey();
  const data = `${sanitizedName.toLowerCase()}|${companyInfo.email.toLowerCase()}|${companyInfo.expiryDate}|${secretKey}`;
  
  // DEBUG: Log generation details
  console.log('\n--- License Key Generation ---');
  console.log('Sanitized Name:', sanitizedName);
  console.log('Email:', companyInfo.email);
  console.log('Expiry Date:', companyInfo.expiryDate);
  console.log('Secret Key (first 20 chars):', secretKey.substring(0, 20) + '...');
  console.log('Secret Key Length:', secretKey.length);
  console.log('Full Payload:', data);
  
  const hash = await simpleHash(data);
  const result = hash.toUpperCase().substring(0, 32);
  console.log('Generated Hash (first 32):', result);
  console.log('------------------------------\n');
  
  return result;
}

/**
 * Verify the license key locally without external API
 * @param licenseKey - The license key to verify
 * @param companyInfo - Company information to validate against
 * @returns Promise<LicenseVerificationResult>
 */
export async function verifyLicenseKey(licenseKey: string, companyInfo?: CompanyInfo): Promise<LicenseVerificationResult> {
  // DEBUG: Log all input values
  console.log('\n========== LICENSE VERIFICATION DEBUG ==========');
  console.log('Input License Key:', licenseKey);
  console.log('Input Company Info:', companyInfo);
  console.log('Company Name:', companyInfo?.companyName);
  console.log('Email:', companyInfo?.email);
  console.log('Expiry Date:', companyInfo?.expiryDate);
  console.log('Expiry Date Type:', typeof companyInfo?.expiryDate);
  console.log('===============================================\n');

  if (!licenseKey || licenseKey.trim() === '') {
    console.log('❌ ERROR: License key is empty');
    return {
      isValid: false,
      message: 'License key is required'
    };
  }

  if (!companyInfo) {
    console.log('❌ ERROR: Company info is missing');
    return {
      isValid: false,
      message: 'Company information is required for license validation'
    };
  }

  try {
    // Check if the license has expired
    const isExpired = checkLicenseExpiry(companyInfo.expiryDate);
    console.log('License Expired Check:', isExpired ? '❌ EXPIRED' : '✓ VALID');
    
    if (isExpired) {
      console.log('❌ ERROR: License has expired');
      return {
        isValid: false,
        error: 'License has expired'
      };
    }

    // Generate expected license key based on company info
    const expectedKey = await generateLicenseKey(companyInfo);
    console.log('Expected Key (generated):', expectedKey);
    console.log('Provided Key:', licenseKey);
    console.log('Keys Match:', licenseKey.trim().toLowerCase() === expectedKey.toLowerCase() ? '✓ YES' : '❌ NO');

    // Compare the provided key with the expected key
    const isValid = licenseKey.trim().toLowerCase() === expectedKey.toLowerCase();

    if (isValid) {
      console.log('✓ LICENSE VERIFICATION SUCCESSFUL');
      console.log('===============================================\n');
      return {
        isValid: true,
        message: 'License is valid',
        boundCompany: companyInfo.companyName
      };
    } else {
      console.log('❌ LICENSE VERIFICATION FAILED - Keys do not match');
      console.log('===============================================\n');
      return {
        isValid: false,
        error: 'Invalid license key for provided company information'
      };
    }
  } catch (error) {
    console.error('❌ LICENSE VERIFICATION ERROR:', error);
    console.log('===============================================\n');
    return {
      isValid: false,
      error: 'Error occurred during license verification'
    };
  }
}

/**
 * Check if the license has expired based on the expiry date
 * @param expiryDateString - Expiry date in DD/MM/YYYY or YYYY-MM-DD format, or Date object
 * @returns boolean indicating if the license is expired
 */
function checkLicenseExpiry(expiryDateString: string | Date): boolean {
  try {
    let expiryDate: Date;
    
    // Handle Date object
    if (expiryDateString instanceof Date) {
      expiryDate = expiryDateString;
    } else if (!expiryDateString || expiryDateString.trim() === '') {
      // Empty expiry date means no expiration (permanent license)
      return false;
    } else {
      // Try DD/MM/YYYY format first
      if (expiryDateString.includes('/')) {
        const [day, month, year] = expiryDateString.split('/').map(Number);
        expiryDate = new Date(year, month - 1, day);
      } 
      // Try YYYY-MM-DD format (ISO format from HTML date inputs)
      else if (expiryDateString.includes('-')) {
        const [year, month, day] = expiryDateString.split('-').map(Number);
        expiryDate = new Date(year, month - 1, day);
      }
      // Try parsing as generic date string
      else {
        expiryDate = new Date(expiryDateString);
      }
    }

    // Validate the date
    if (isNaN(expiryDate.getTime())) {
      console.error('Invalid expiry date:', expiryDateString);
      return true; // Treat invalid dates as expired
    }

    // Get today's date and compare
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of day for accurate comparison

    return expiryDate < today;
  } catch (error) {
    // If there's an error parsing the date, consider the license invalid
    console.error('Error parsing expiry date:', error);
    return true; // Treat as expired if there's a parsing error
  }
}

/**
 * Verify that the stored company details match the bound license
 * @param storedCompanyInfo - Company information stored in the database
 * @param boundCompanyInfo - Company information bound to the license
 * @returns boolean indicating if details match
 */
export function verifyCompanyBinding(storedCompanyInfo: CompanyInfo, boundCompanyInfo: CompanyInfo): boolean {
  return (
    storedCompanyInfo.companyName.toLowerCase() === boundCompanyInfo.companyName.toLowerCase() &&
    storedCompanyInfo.email.toLowerCase() === boundCompanyInfo.email.toLowerCase()
  );
}

/**
 * Show license verification error dialog
 * @param errorMessage - The error message to display
 */
export async function showLicenseVerificationError(errorMessage: string) {
  await showDialog({
    title: 'License Verification Failed',
    detail: errorMessage,
    type: 'error',
    buttons: [
      {
        label: 'OK',
        isPrimary: true,
      }
    ]
  });
}

/**
 * Creates a hash of the company information for license binding verification
 * @param companyInfo - Company information to hash
 * @returns string hash of the company information
 */
export async function createCompanyBindingHash(companyInfo: CompanyInfo): Promise<string> {
  // Remove spaces from company name before creating binding hash
  const sanitizedName = companyInfo.companyName.replace(/\s+/g, '');
  const data = `${sanitizedName.toLowerCase()}|${companyInfo.email.toLowerCase()}|${companyInfo.expiryDate}|${getSecretKey()}`;
  return await simpleHash(data);
}