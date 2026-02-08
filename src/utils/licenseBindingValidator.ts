import { Fyo } from 'fyo';
import { showDialog } from 'src/utils/interactive';
import { CompanyInfo, verifyCompanyBinding } from 'src/utils/licenseVerification';

/**
 * Validates that the current installation's company details match the bound license
 * @param fyo - The Fyo instance
 * @returns boolean indicating if the license is valid for this company
 */
export async function validateLicenseBinding(fyo: Fyo): Promise<boolean> {
  try {
    const systemSettings = await fyo.doc.getDoc('SystemSettings');
    const accountingSettings = await fyo.doc.getDoc('AccountingSettings');
    
    // If no license is present, allow operation (free version)
    if (!systemSettings.licenseKey) {
      return true;
    }
    
    // If license is not bound, something went wrong during setup
    if (!systemSettings.licenseBound) {
      await showLicenseBindingError('License is not properly bound to company details');
      return false;
    }
    
    // Create objects to compare
    const storedCompanyInfo: CompanyInfo = {
      companyName: accountingSettings.companyName || '',
      email: accountingSettings.email || '',
      instanceId: systemSettings.instanceId || '',
      companyRegistrationNumber: systemSettings.boundCompanyRegistrationNumber
    };
    
    const boundCompanyInfo: CompanyInfo = {
      companyName: systemSettings.boundCompanyName || '',
      email: accountingSettings.email || '', // Use accounting settings email as it's the source of truth
      instanceId: systemSettings.instanceId || '',
      companyRegistrationNumber: systemSettings.boundCompanyRegistrationNumber
    };
    
    // Verify that the stored company details match the bound license details
    const isValid = verifyCompanyBinding(storedCompanyInfo, boundCompanyInfo);
    
    if (!isValid) {
      await showLicenseBindingError('Company details do not match the bound license.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating license binding:', error);
    await showLicenseBindingError('Error validating license binding. Please restart the application.');
    return false;
  }
}

/**
 * Shows an error dialog for license binding issues
 * @param message - The error message to display
 */
export async function showLicenseBindingError(message: string) {
  await showDialog({
    title: 'License Binding Error',
    detail: message,
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
 * Performs a periodic license validation check
 * @param fyo - The Fyo instance
 * @returns boolean indicating if the license is still valid
 */
export async function periodicLicenseCheck(fyo: Fyo): Promise<boolean> {
  // In a real implementation, this would contact the license server periodically
  // For now, just validate the local binding
  return await validateLicenseBinding(fyo);
}

/**
 * Starts periodic license validation checks
 * @param fyo - The Fyo instance
 * @param intervalMinutes - Interval in minutes between checks (default: 60)
 */
export async function startPeriodicLicenseChecks(fyo: Fyo, intervalMinutes: number = 60): Promise<void> {
  const intervalMs = intervalMinutes * 60 * 1000;

  setInterval(async () => {
    try {
      const isValid = await periodicLicenseCheck(fyo);
      if (!isValid) {
        // If license becomes invalid during operation, show warning
        await showLicenseBindingError('License validation failed.');
      }
    } catch (error) {
      console.error('Error during periodic license check:', error);
    }
  }, intervalMs);
}