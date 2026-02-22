const crypto = require('crypto');

// Deobfuscate function - MUST EXACTLY match src/utils/secretParts.ts
function deobfuscatePart(obfuscatedPart, key) {
  const decoded = Buffer.from(obfuscatedPart, 'base64').toString('utf8');
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

// These values MUST match src/utils/secretParts.ts exactly
const OBFUSCATED_PART_1 = 'OjE8UCk1VDgoITNwRQE/KisgNBAgClhE';
const OBFUSCATION_KEY_1 = 'mySecretKey1!';
const SECRET_PART_1 = deobfuscatePart(OBFUSCATED_PART_1, OBFUSCATION_KEY_1);

const OBFUSCATED_PART_2 = 'LxchLAtVJCMrEGhxMjlXDiMJPCA3Hg99';
const OBFUSCATION_KEY_2 = 'anotherKey2@';
const SECRET_PART_2 = deobfuscatePart(OBFUSCATED_PART_2, OBFUSCATION_KEY_2);

const OBFUSCATED_PART_3 = 'Oy5cOgUOCkh4ayYyMBlQfi4veU8iD1RP';
const OBFUSCATION_KEY_3 = 'thirdKey3#';
const SECRET_PART_3 = deobfuscatePart(OBFUSCATED_PART_3, OBFUSCATION_KEY_3);

const OBFUSCATED_PART_4 = 'KzwjPBUDMw83fBE3DiBKRzENFU1iU1tS';
const OBFUSCATION_KEY_4 = 'fourthKey4$';
const SECRET_PART_4 = deobfuscatePart(OBFUSCATED_PART_4, OBFUSCATION_KEY_4);

const OBFUSCATED_PART_5 = 'K1oeNgl6IwN7T18gPB85MjJLBG4EDltJ';
const OBFUSCATION_KEY_5 = 'fifthKey5%';
const SECRET_PART_5 = deobfuscatePart(OBFUSCATED_PART_5, OBFUSCATION_KEY_5);

// Build secret key (MUST match licenseVerification.ts)
const specialChars = String.fromCharCode(64, 35, 36, 37, 94); // "@#$%^"
const secretKey = SECRET_PART_1 + SECRET_PART_2 + SECRET_PART_3 + SECRET_PART_4 + SECRET_PART_5 + specialChars;

// DEBUG: Show what secret key we're using
console.log('Secret Key Length:', secretKey.length);
console.log('Secret Key (first 20 chars):', secretKey.substring(0, 20) + '...');
console.log('');

// Company info - CHANGE THESE VALUES AS NEEDED
const companyName = 'herry';
const email = 'herry@gmail.com';
const expiryDate = '31/12/2027';  // Extended to 31st Dec 2027

// Sanitize company name (remove spaces)
const sanitizedName = companyName.replace(/\s+/g, '');

// Generate payload
const payload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${secretKey}`;

// Generate hash
const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
const licenseKey = hash.substring(0, 32).toUpperCase();

console.log('╔════════════════════════════════════════╗');
console.log('║     License Key Generator              ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log('Company Name:  ', companyName);
console.log('Email:         ', email);
console.log('Expiry Date:   ', expiryDate);
console.log('');
console.log('─────────────────────────────────────────');
console.log('Generated License Key:');
console.log('');
console.log('  ★ ' + licenseKey + ' ★');
console.log('');
console.log('─────────────────────────────────────────');
console.log('');
