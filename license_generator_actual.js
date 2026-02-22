const crypto = require('crypto');

// The ACTUAL secret key from the running application (85 characters)
// This was extracted from the console log output
const ACTUAL_SECRET_KEY = 'Xz9$mKp2@vQr4!nL7#WsEa6&uIo3*SdF8^GhJ5(tYbN9)ReV1%MjLc4~PiO7`ZxW3|AkQs6?HfD2[mJn@#$%^';

console.log('╔════════════════════════════════════════╗');
console.log('║   License Generator - ACTUAL KEY       ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log('Using actual application secret key (85 chars)');
console.log('');

// Company info
const companyName = 'herry1';
const email = 'herry1@gmail.com';
const expiryDate = '31/12/2027';

// Sanitize company name (remove spaces)
const sanitizedName = companyName.replace(/\s+/g, '');

// Generate payload (same format as licenseVerification.ts)
const payload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${ACTUAL_SECRET_KEY}`;

console.log('Company Name:', companyName);
console.log('Email:', email);
console.log('Expiry Date:', expiryDate);
console.log('');
console.log('Payload:', payload);
console.log('');

// Generate hash
const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
const licenseKey = hash.substring(0, 32).toUpperCase();

console.log('─────────────────────────────────────────');
console.log('Generated License Key:');
console.log('');
console.log('  ★ ' + licenseKey + ' ★');
console.log('');
console.log('─────────────────────────────────────────');
console.log('');
console.log('This key should work with your application!');
