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
    { name: "AES-GCM", iv },
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
  const ptBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, dek, ct);
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
