import { showDialog } from './interactive';

export interface CompanyInfo {
  companyName: string;
  companyRegistrationNumber?: string;
  email: string;
  instanceId: string;
}

export interface LicenseVerificationResult {
  isValid: boolean;
  message?: string;
  error?: string;
  boundCompany?: string;
}

/**
 * Verify the license key with the API and bind it to company details
 * @param licenseKey - The license key to verify
 * @param companyInfo - Company information to bind to the license
 * @returns Promise<LicenseVerificationResult>
 */
export async function verifyLicenseKey(licenseKey: string, companyInfo?: CompanyInfo): Promise<LicenseVerificationResult> {
  if (!licenseKey || licenseKey.trim() === '') {
    return {
      isValid: false,
      message: 'License key is required'
    };
  }

  try {
    // In a real implementation, this would be your actual license verification API endpoint
    const requestBody: any = {
      licenseKey: licenseKey.trim(),
    };

    // Include company details if provided
    if (companyInfo) {
      requestBody.companyInfo = {
        companyName: companyInfo.companyName,
        companyRegistrationNumber: companyInfo.companyRegistrationNumber,
        email: companyInfo.email,
        instanceId: companyInfo.instanceId
      };
    }

    const response = await fetch('https://api.example.com/verify-license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (response.ok) {
      return {
        isValid: result.valid || false,
        message: result.message,
        boundCompany: result.boundCompany
      };
    } else {
      return {
        isValid: false,
        error: result.error || 'License verification failed'
      };
    }
  } catch (error) {
    console.error('License verification error:', error);
    return {
      isValid: false,
      error: 'Network error occurred during license verification'
    };
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
    storedCompanyInfo.companyName === boundCompanyInfo.companyName &&
    storedCompanyInfo.companyRegistrationNumber === boundCompanyInfo.companyRegistrationNumber &&
    storedCompanyInfo.email === boundCompanyInfo.email &&
    storedCompanyInfo.instanceId === boundCompanyInfo.instanceId
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
 * In a real implementation, this would be done server-side
 * @param companyInfo - Company information to hash
 * @returns string hash of the company information
 */
export function createCompanyBindingHash(companyInfo: CompanyInfo): string {
  // In a real implementation, this would use a proper cryptographic hash
  // and would be computed server-side to prevent tampering
  const str = `${companyInfo.companyName}|${companyInfo.email}|${companyInfo.instanceId}|${companyInfo.companyRegistrationNumber || ''}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}