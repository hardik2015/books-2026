import { Fyo } from 'fyo';
import { showDialog } from './interactive';

/**
 * Check if company details have been locked after initial setup
 * @param fyo - The Fyo instance
 * @returns boolean indicating if company details are locked
 */
export async function areCompanyDetailsLocked(fyo: Fyo): Promise<boolean> {
  const accountingSettings = await fyo.doc.getDoc('AccountingSettings');
  const systemSettings = await fyo.doc.getDoc('SystemSettings');
  
  // Check if setup is complete, which indicates initial company details were set
  const setupComplete = accountingSettings?.setupComplete;
  
  return !!setupComplete;
}

/**
 * Validate that company details haven't been changed
 * @param fyo - The Fyo instance
 * @param newValues - New values being set
 * @param originalValues - Original values for comparison
 * @returns boolean indicating if validation passed
 */
export async function validateCompanyDetailsChange(
  fyo: Fyo, 
  newValues: Record<string, any>, 
  originalValues: Record<string, any>
): Promise<boolean> {
  const isLocked = await areCompanyDetailsLocked(fyo);
  
  if (!isLocked) {
    // If not locked, allow changes (during initial setup)
    return true;
  }

  // Define fields that should be immutable after setup
  const immutableFields = ['companyName', 'email', 'fullname', 'country'];
  
  for (const field of immutableFields) {
    if (newValues[field] !== undefined && newValues[field] !== originalValues[field]) {
      await showDialog({
        title: 'Company Details Locked',
        detail: `Company details cannot be changed after initial setup. The "${field}" field is locked.`,
        type: 'warning',
        buttons: [{
          label: 'OK',
          isPrimary: true,
        }]
      });
      
      return false;
    }
  }
  
  return true;
}

/**
 * Show an error dialog when company details change is attempted
 * @param fieldName - The name of the field that cannot be changed
 */
export async function showCompanyDetailsLockError(fieldName: string) {
  await showDialog({
    title: 'Company Details Locked',
    detail: `The "${fieldName}" field cannot be changed after initial setup.`,
    type: 'error',
    buttons: [{
      label: 'OK',
      isPrimary: true,
    }]
  });
}