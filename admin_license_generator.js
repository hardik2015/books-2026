const crypto = require("crypto");

function buildSecretKey() {
  const parts = [
    "WHo5JG1LcDJAdlFyNCFuTA==",
    "NyNXc0VhNiZ1SW8zKlNkRg==",
    "OF5HaEo1KHRZYk45KVJlVg==",
    "MSVNakxjNH5QaU83YFp4Vw==",
    "M3xBa1FzNj9IZkQyW21Kbg==",
  ];

  const decoded = parts.map((p) => Buffer.from(p, "base64").toString("utf8"));
  const obfuscation = String.fromCharCode(64, 35, 36, 37, 94); // "@#$%^"

  return decoded.join("") + obfuscation;
}

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  // Use the same field names as your application
  const companyName = req.query.companyName || (req.body && req.body.companyName);
  const expiryDate = req.query.expiryDate || (req.body && req.body.expiryDate);
  const email = req.query.email || (req.body && req.body.email);

  if (!companyName || !expiryDate || !email) {
    context.res = {
      status: 400,
      body: "Missing required values. Provide companyName, expiryDate, and email.",
    };
    return;
  }

  // Apply the same processing as your application
  const sanitizedName = companyName.replace(/\s+/g, ''); // Remove spaces
  const secretKey = buildSecretKey();
  
  // Use the same format as your application: sanitizedLowercaseName|lowercaseEmail|expiryDate|secretKey
  const payload = `${sanitizedName.toLowerCase()}|${email.toLowerCase()}|${expiryDate}|${secretKey}`;
  
  const hash = crypto.createHash("sha256").update(payload, "utf8").digest("hex");
  
  // Return only the first 32 characters (uppercase) as your application does
  const licenseKey = hash.substring(0, 32).toUpperCase();

  context.res = {
    status: 200,
    body: { 
      licenseKey,
      // Include the original values for verification/debugging
      companyName,
      email,
      expiryDate
    },
  };
};