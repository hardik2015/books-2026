// This script tests the ACTUAL secret key being used in the application
// Run this AFTER building the app to verify the secret key

const crypto = require('crypto');

console.log('=== License Key Debug Test ===\n');

// Test 1: Using deobfuscated secret (from secretParts.ts)
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

console.log('Secret Key Parts:');
console.log('  Part 1:', SECRET_PART_1);
console.log('  Part 2:', SECRET_PART_2);
console.log('  Part 3:', SECRET_PART_3);
console.log('  Part 4:', SECRET_PART_4);
console.log('  Part 5:', SECRET_PART_5);
console.log('  Full Secret:', secretKey);
console.log('  Length:', secretKey.length);

// Test 2: Generate license with different company info variations
const testCases = [
  { companyName: 'herry', email: 'herry@gmail.com', expiryDate: '31/12/2027' },
  { companyName: 'Herry', email: 'herry@gmail.com', expiryDate: '31/12/2027' },
  { companyName: 'herry', email: 'Herry@Gmail.com', expiryDate: '31/12/2027' },
  { companyName: 'herry', email: 'herry@gmail.com', expiryDate: '2027-12-31' },
  { companyName: 'herry ', email: 'herry@gmail.com', expiryDate: '31/12/2027' },
];

console.log('\n=== Testing Different Input Variations ===\n');

testCases.forEach((test, index) => {
  const sanitizedName = test.companyName.replace(/\s+/g, '');
  const payload = `${sanitizedName.toLowerCase()}|${test.email.toLowerCase()}|${test.expiryDate}|${secretKey}`;
  const hash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
  const licenseKey = hash.substring(0, 32).toUpperCase();
  
  console.log(`Test ${index + 1}:`);
  console.log(`  Company: "${test.companyName}" → "${sanitizedName}"`);
  console.log(`  Email: "${test.email}"`);
  console.log(`  Expiry: "${test.expiryDate}"`);
  console.log(`  Payload: ${payload.substring(0, 50)}...`);
  console.log(`  License: ${licenseKey}`);
  console.log('');
});

// Test 3: Compare with the key you entered
const enteredKey = 'F537A0353404484AB54759D25212C61B';
const expectedKey = crypto.createHash('sha256')
  .update(`herry|herry@gmail.com|31/12/2027|${secretKey}`, 'utf8')
  .digest('hex')
  .substring(0, 32)
  .toUpperCase();

console.log('=== Key Comparison ===');
console.log('Entered Key: ', enteredKey);
console.log('Expected Key:', expectedKey);
console.log('Match:', enteredKey === expectedKey ? '✓ YES' : '✗ NO');
console.log('');

if (enteredKey !== expectedKey) {
  console.log('⚠ MISMATCH DETECTED!');
  console.log('The secret key in your application is DIFFERENT from this generator.');
  console.log('');
  console.log('Possible causes:');
  console.log('  1. The app was built with different secretParts.ts values');
  console.log('  2. There is a build cache issue');
  console.log('  3. The obfuscation keys are different');
  console.log('');
  console.log('Solution:');
  console.log('  1. Check src/utils/secretParts.ts for the actual values');
  console.log('  2. Run: yarn build (to rebuild with latest code)');
  console.log('  3. Restart the application completely');
}
