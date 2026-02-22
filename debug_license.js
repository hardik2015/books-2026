const crypto = require('crypto');

// Test the date parsing logic
function checkLicenseExpiry(expiryDateString) {
  console.log('\n=== Testing Date Parsing ===');
  console.log('Input date string:', expiryDateString);
  
  try {
    const [day, month, year] = expiryDateString.split('/').map(Number);
    console.log('Parsed: day=', day, 'month=', month, 'year=', year);
    
    const expiryDate = new Date(year, month - 1, day);
    console.log('Expiry Date object:', expiryDate);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Today:', today);
    
    const isExpired = expiryDate < today;
    console.log('Is Expired:', isExpired);
    
    return isExpired;
  } catch (error) {
    console.error('Error parsing date:', error);
    return true;
  }
}

// Test different date formats
console.log('Testing different date formats:');
checkLicenseExpiry('31/12/2027');
checkLicenseExpiry('01/05/2026');
checkLicenseExpiry('21/02/2026');
checkLicenseExpiry('2027-12-31');

// Now test the full license verification
function deobfuscatePart(obfuscatedPart, key) {
  const decoded = Buffer.from(obfuscatedPart, 'base64').toString('utf8');
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

const SECRET_PART_1 = deobfuscatePart('OjE8UCk1VDgoITNwRQE/KisgNBAgClhE', 'mySecretKey1!');
const SECRET_PART_2 = deobfuscatePart('LxchLAtVJCMrEGhxMjlXDiMJPCA3Hg99', 'anotherKey2@');
const SECRET_PART_3 = deobfuscatePart('Oy5cOgUOCkh4ayYyMBlQfi4veU8iD1RP', 'thirdKey3#');
const SECRET_PART_4 = deobfuscatePart('KzwjPBUDMw83fBE3DiBKRzENFU1iU1tS', 'fourthKey4$');
const SECRET_PART_5 = deobfuscatePart('K1oeNgl6IwN7T18gPB85MjJLBG4EDltJ', 'fifthKey5%');

const secretKey = SECRET_PART_1 + SECRET_PART_2 + SECRET_PART_3 + SECRET_PART_4 + SECRET_PART_5 + '@#$%^';

console.log('\n=== Secret Key Debug ===');
console.log('SECRET_PART_1:', SECRET_PART_1);
console.log('SECRET_PART_2:', SECRET_PART_2);
console.log('SECRET_PART_3:', SECRET_PART_3);
console.log('SECRET_PART_4:', SECRET_PART_4);
console.log('SECRET_PART_5:', SECRET_PART_5);
console.log('Full Secret Key:', secretKey);
console.log('Secret Key Length:', secretKey.length);

// Generate license key
const companyName = 'herry';
const email = 'herry@gmail.com';
const expiryDate = '31/12/2027';

const sanitizedName = companyName.replace(/\s+/g, '');
const payload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${secretKey}`;

console.log('\n=== License Generation ===');
console.log('Company Name:', companyName);
console.log('Sanitized Name:', sanitizedName);
console.log('Email:', email);
console.log('Expiry Date:', expiryDate);
console.log('Payload:', payload);

const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
const licenseKey = hash.substring(0, 32).toUpperCase();

console.log('\nGenerated License Key:', licenseKey);

// Verify
const testLicenseKey = 'F537A0353404484AB54759D25212C61B';
const isValid = testLicenseKey.toLowerCase() === licenseKey.toLowerCase();
console.log('\n=== Verification ===');
console.log('Test Key:', testLicenseKey);
console.log('Expected Key:', licenseKey);
console.log('Match:', isValid);
