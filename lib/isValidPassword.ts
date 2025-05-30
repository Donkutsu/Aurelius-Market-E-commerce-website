export async function isValidPassword(password: string, hashedPassword: string) {
  
    return (await hashPassword(password)) === hashedPassword;
}

// Function to hash a password using SHA-512 and return a base64 encoded string
// This function was provided in your third image (isValidPassword.ts)
async function hashPassword(password: string): Promise<string> {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("base64");
}