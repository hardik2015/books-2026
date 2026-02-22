// Test to find what the ACTUAL secret key is in the running app
// The secretParts.ts file has OBFUSCATED values that get deobfuscated at runtime

// These are the RAW values from secretParts.ts (already obfuscated)
const OBFUSCATED_PART_1 = 'OjE8UCk1VDgoITNwRQE/KisgNBAgClhE';
const OBFUSCATED_PART_2 = 'LxchLAtVJCMrEGhxMjlXDiMJPCA3Hg99';
const OBFUSCATED_PART_3 = 'Oy5cOgUOCkh4ayYyMBlQfi4veU8iD1RP';
const OBFUSCATED_PART_4 = 'KzwjPBUDMw83fBE3DiBKRzENFU1iU1tS';
const OBFUSCATED_PART_5 = 'K1oeNgl6IwN7T18gPB85MjJLBG4EDltJ';

const KEY_1 = 'mySecretKey1!';
const KEY_2 = 'anotherKey2@';
const KEY_3 = 'thirdKey3#';
const KEY_4 = 'fourthKey4$';
const KEY_5 = 'fifthKey5%';

function deobfuscatePart(obfuscatedPart, key) {
  const decoded = Buffer.from(obfuscatedPart, 'base64').toString('utf8');
  console.log('  Decoded (base64):', decoded);
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

console.log('=== Deobfuscation Process ===\n');

console.log('PART 1 (key: ' + KEY_1 + '):');
const p1 = deobfuscatePart(OBFUSCATED_PART_1, KEY_1);
console.log('  Result:', p1);

console.log('\nPART 2 (key: ' + KEY_2 + '):');
const p2 = deobfuscatePart(OBFUSCATED_PART_2, KEY_2);
console.log('  Result:', p2);

console.log('\nPART 3 (key: ' + KEY_3 + '):');
const p3 = deobfuscatePart(OBFUSCATED_PART_3, KEY_3);
console.log('  Result:', p3);

console.log('\nPART 4 (key: ' + KEY_4 + '):');
const p4 = deobfuscatePart(OBFUSCATED_PART_4, KEY_4);
console.log('  Result:', p4);

console.log('\nPART 5 (key: ' + KEY_5 + '):');
const p5 = deobfuscatePart(OBFUSCATED_PART_5, KEY_5);
console.log('  Result:', p5);

const fullSecret = p1 + p2 + p3 + p4 + p5 + '@#$%^';
console.log('\n=== Full Secret Key ===');
console.log(fullSecret);
console.log('\nLength:', fullSecret.length);
