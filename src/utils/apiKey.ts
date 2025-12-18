import { createHash, randomBytes } from "crypto";

const API_KEY_PREFIX = "mrnw_";

/**
 * Generates a new API key with the format: mrnw_<random-string>
 * Returns the plain text key (only shown once to user)
 */
export function generateApiKey(): string {
  const randomPart = randomBytes(32).toString("base64url");
  return `${API_KEY_PREFIX}${randomPart}`;
}

/**
 * Creates a SHA-256 hash of the API key for secure storage
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Verifies a provided API key against a stored hash
 */
export function verifyApiKey(providedKey: string, storedHash: string): boolean {
  const providedHash = hashApiKey(providedKey);
  return providedHash === storedHash;
}

/**
 * Extracts the prefix portion of an API key for display
 * Returns first 12 characters (e.g., "mrnw_abc1234...")
 */
export function getKeyPrefix(key: string): string {
  return key.substring(0, 12);
}

/**
 * Validates that a string looks like a valid API key
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length > API_KEY_PREFIX.length + 20;
}
