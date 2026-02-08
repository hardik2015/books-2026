// Individual secret key parts stored separately for enhanced security
// Using multiple obfuscation layers to prevent easy extraction

// Helper function to obfuscate/restore the secret parts
function obfuscatePart(part: string, key: string): string {
  let result = '';
  for (let i = 0; i < part.length; i++) {
    const charCode = part.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Return as base64 to maintain format
}

function deobfuscatePart(obfuscatedPart: string, key: string): string {
  const decoded = atob(obfuscatedPart); // First decode the base64
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

// Obfuscated secret parts with unique keys
const OBFUSCATED_PART_1 = 'OjE8UCk1VDgoITNwRQE/KisgNBAgClhE';
const OBFUSCATION_KEY_1 = 'mySecretKey1!';
export const SECRET_PART_1 = deobfuscatePart(OBFUSCATED_PART_1, OBFUSCATION_KEY_1);

const OBFUSCATED_PART_2 = 'LxchLAtVJCMrEGhxMjlXDiMJPCA3Hg99';
const OBFUSCATION_KEY_2 = 'anotherKey2@';
export const SECRET_PART_2 = deobfuscatePart(OBFUSCATED_PART_2, OBFUSCATION_KEY_2);

const OBFUSCATED_PART_3 = 'Oy5cOgUOCkh4ayYyMBlQfi4veU8iD1RP';
const OBFUSCATION_KEY_3 = 'thirdKey3#';
export const SECRET_PART_3 = deobfuscatePart(OBFUSCATED_PART_3, OBFUSCATION_KEY_3);

const OBFUSCATED_PART_4 = 'KzwjPBUDMw83fBE3DiBKRzENFU1iU1tS';
const OBFUSCATION_KEY_4 = 'fourthKey4$';
export const SECRET_PART_4 = deobfuscatePart(OBFUSCATED_PART_4, OBFUSCATION_KEY_4);

const OBFUSCATED_PART_5 = 'K1oeNgl6IwN7T18gPB85MjJLBG4EDltJ';
const OBFUSCATION_KEY_5 = 'fifthKey5%';
export const SECRET_PART_5 = deobfuscatePart(OBFUSCATED_PART_5, OBFUSCATION_KEY_5);

// Additional obfuscation parts - using computed properties
const codes = [64, 35, 36, 37, 94]; // "@#$%^" in ASCII
export const SPECIAL_CHARS_CODES = codes.map(code => code);