import crypto from "node:crypto";
import { promisify } from "node:util";

const generateKeyPair = promisify(crypto.generateKeyPair);

/**
 * Generates a new RSA key pair of the given key size.
 * @param keySize Key size.
 * @returns RSA key pair.
 */
export function generateRsaKeyPair(keySize: number = 4096) {
  return generateKeyPair("rsa", {
    modulusLength: keySize,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
}

/**
 * Decrypt cipher text using the given asymmetric private key.
 * @param privateKey Asymmetric private key.
 * @param cipherText Cipher text.
 * @param oaepHash Hash function to use for OAEP padding and MGF1.
 * @param padding Padding value.
 * @returns Decrypted text.
 */
export function asymmetricDecrypt(
  privateKey: string,
  cipherText: Buffer,
  oaepHash: string = "sha512",
  padding: number = crypto.constants.RSA_PKCS1_OAEP_PADDING
) {
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        oaepHash,
        padding,
      },
      cipherText
    )
    .toString("utf8");
}
