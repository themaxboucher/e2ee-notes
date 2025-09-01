"use client"; // Encrypt/decrypt client-side only

const enc = new TextEncoder();
const dec = new TextDecoder();

export function bytesToB64(bytes: Uint8Array): string {
  // ok for typical note sizes
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export function b64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

export function randomIv(): Uint8Array {
  // AES-GCM standard: 12 random bytes
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  return iv;
}

// --- 1) Create a DEK ---
// extractable: true for dev so we can export/import it. We'll lock this down later.
export async function createDek(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, // AES-256-GCM
    true, // extractable (dev only)
    ["encrypt", "decrypt"]
  );
}

// --- 2) Encrypt with the DEK ---
export async function encryptWithDek(
  dek: CryptoKey,
  plaintext: string
): Promise<{ ciphertextB64: string; ivB64: string }> {
  const iv = randomIv();
  const ctBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    dek,
    enc.encode(plaintext)
  );
  return {
    ciphertextB64: bytesToB64(new Uint8Array(ctBuf)),
    ivB64: bytesToB64(iv),
  };
}

// --- 3) Decrypt with the DEK ---
export async function decryptWithDek(
  dek: CryptoKey,
  ciphertextB64: string,
  ivB64: string
): Promise<string> {
  const ct = b64ToBytes(ciphertextB64);
  const iv = b64ToBytes(ivB64);
  const ptBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    dek,
    ct as BufferSource
  );
  return dec.decode(ptBuf);
}

// --- 4) (Dev only) export/import DEK so you can persist it temporarily ---
// JWK = JSON Web Key (a JSON object representation of a key)
export async function exportDekToJwk(dek: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey("jwk", dek);
}
export async function importDekFromJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM", length: 256 },
    true, // extractable (dev)
    ["encrypt", "decrypt"]
  );
}

/** Random bytes helper */
export function randBytes(len: number) {
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return a;
}

/**
 * Derive a KEK from a passphrase using PBKDF2-SHA256.
 * - passphrase: user's input
 * - saltB64: per-user random salt (Base64) stored in DB (not secret)
 * - iterations: e.g., 200_000
 * Returns an AES-GCM 256-bit CryptoKey usable for encrypt/decrypt.
 */
export async function deriveKek(
  passphrase: string,
  saltB64: string,
  iterations = 200_000
): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const kek = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: b64ToBytes(saltB64) as BufferSource,
      iterations,
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false, // not extractable (good for security)
    ["encrypt", "decrypt"]
  );
  return kek;
}

/** Generate a new random salt to store for this user (16 bytes is good). */
export function generateKdfSaltB64() {
  return bytesToB64(randBytes(16));
}

/** AES-GCM wants a fresh random 12-byte IV every encryption. */
export function randomIv12B64() {
  return bytesToB64(randBytes(12));
}

/** Wrap (encrypt) a DEK with a KEK using AES-GCM. */
export async function wrapDekWithKek(
  dek: CryptoKey,
  kek: CryptoKey
): Promise<{ wrappedDekB64: string; ivB64: string }> {
  // Export DEK in "raw" form (requires dek.extractable === true at creation time)
  const dekRaw = await crypto.subtle.exportKey("raw", dek); // ArrayBuffer
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    kek,
    dekRaw
  );

  return {
    wrappedDekB64: bytesToB64(new Uint8Array(ct)),
    ivB64: bytesToB64(iv),
  };
}

/** Unwrap (decrypt) a DEK with a KEK using AES-GCM. */
export async function unwrapDekWithKek(
  wrappedDekB64: string,
  ivB64: string,
  kek: CryptoKey
): Promise<CryptoKey> {
  const ct = b64ToBytes(wrappedDekB64);
  const iv = b64ToBytes(ivB64);

  const dekRaw = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    kek,
    ct as BufferSource
  );

  // Import DEK for AES-GCM encrypt/decrypt of notes.
  // Make it non-extractable for better security in production.
  const dek = await crypto.subtle.importKey(
    "raw",
    dekRaw,
    { name: "AES-GCM", length: 256 },
    false, // non-extractable (good!)
    ["encrypt", "decrypt"]
  );
  return dek;
}
