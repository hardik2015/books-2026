const crypto = require('crypto');

// The ACTUAL secret parts from the application (after decoding)
// These need to match what's in src/utils/secretParts.ts AFTER deobfuscation

// Method 1: Using the deobfuscation (like the app does)
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

console.log('=== Deobfuscated Secret Key ===');
console.log('SECRET_PART_1:', SECRET_PART_1);
console.log('SECRET_PART_2:', SECRET_PART_2);
console.log('SECRET_PART_3:', SECRET_PART_3);
console.log('SECRET_PART_4:', SECRET_PART_4);
console.log('SECRET_PART_5:', SECRET_PART_5);
console.log('Full Secret Key:', secretKey);

// Now generate license with this key
const companyName = 'herry';
const email = 'herry@gmail.com';
const expiryDate = '31/12/2027';

const sanitizedName = companyName.replace(/\s+/g, '');
const payload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${secretKey}`;
const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
const licenseKey = hash.substring(0, 32).toUpperCase();

console.log('\n=== Generated License ===');
console.log('License Key:', licenseKey);

// Test with the OLD admin_license_generator.js method (base64 encoded parts)
console.log('\n\n=== OLD Method (admin_license_generator.js) ===');
const oldParts = [
  "WHo5JG1LcDJAdlFyNCFuTA==",
  "NyNXc0VhNiZ1SW8zKlNkRg==",
  "OF5HaEo1KHRZYk45KVJlVg==",
  "MSVNakxjNH5QaU83YFp4Vw==",
  "M3xBa1FzNj9IZkQyW21Kbg==",
];

const oldDecoded = oldParts.map((p) => Buffer.from(p, "base64").toString("utf8"));
const oldObfuscation = String.fromCharCode(64, 35, 36, 37, 94); // "@#$%^"
const oldSecretKey = oldDecoded.join("") + oldObfuscation;

console.log('Old Secret Key:', oldSecretKey);

const oldPayload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${oldSecretKey}`;
const oldHash = crypto.createHash('sha256').update(oldPayload, 'utf8').digest('hex');
const oldLicenseKey = oldHash.substring(0, 32).toUpperCase();

console.log('Old License Key:', oldLicenseKey);

console.log('\n=== Comparison ===');
console.log('New Key:', licenseKey);
console.log('Old Key:', oldLicenseKey);
console.log('Match:', licenseKey === oldLicenseKey);
