import crypto from "node:crypto";
import { promisify } from "node:util";
import { Vault } from "@src/types.js";

const generateKeyPair = promisify(crypto.generateKeyPair);

const IV_SIZE = 12; // Standard nonce size for GCM

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

async function kemDecrypt(input: {
  privateKey: string;
  cipher: Buffer;
  iv: Buffer;
  symmetricAlgorithm: string;
  asymmetricAlgorithm: string;
  kdf: string;
  encryptedSalt: Buffer;
  password: string;
  iterationCount: number;
  hashAlgorithm: string;
}): Promise<string> {
  if (input.symmetricAlgorithm != KEMSymmetricAlgorithm.AES256_GCM) {
    throw Error(`Unsupported symmetric algorithm: ${input.symmetricAlgorithm}`);
  }

  if (
    input.asymmetricAlgorithm !=
    Vault.ExportEncryptionAlgorithm.RSA4096_NO_PADDING_KEM
  ) {
    throw Error(
      `Unsupported asymmetric algorithm: ${input.asymmetricAlgorithm}`
    );
  }

  if (input.kdf != KEMkdf.PBKDF2) {
    throw Error(`Unsupported kdf: ${input.kdf}`);
  }

  if (input.hashAlgorithm != KEMHashAlgorithm.SHA512) {
    throw Error(`Unsupported hash algorithm: ${input.hashAlgorithm}`);
  }

  const salt = crypto.privateDecrypt(
    {
      key: input.privateKey,
      padding: crypto.constants.RSA_NO_PADDING,
    },
    input.encryptedSalt
  );
  const keyLength = getKeyLength(input.symmetricAlgorithm);
  const symmetricKey = crypto.pbkdf2Sync(
    Buffer.from(input.password),
    salt,
    input.iterationCount,
    keyLength,
    input.hashAlgorithm
  );

  const key = await crypto.subtle.importKey(
    "raw",
    symmetricKey,
    {
      name: "AES-GCM",
    },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: input.iv },
    key,
    input.cipher
  );
  const enc = new TextDecoder("ascii");
  return enc.decode(decrypted);
}

export enum KEMHashAlgorithm {
  SHA512 = "sha512",
}

export enum KEMSymmetricAlgorithm {
  AES256_GCM = "AES-GCM-256",
}

export enum KEMkdf {
  PBKDF2 = "pbkdf2",
}

function getKeyLength(algorithm: string): number {
  if (algorithm == KEMSymmetricAlgorithm.AES256_GCM) {
    return 32;
  }
  throw Error(`Unsupported algorithm: ${algorithm}`);
}

export async function kemDecryptExportResult(
  result: Vault.ExportResult,
  password: string,
  privateKey: string
) {
  let cipherEncoded = result.private_key;
  if (!cipherEncoded) {
    cipherEncoded = result.key;
  }
  if (!cipherEncoded) {
    throw TypeError("`private_key` or `key` should be set.");
  }

  const cipherWithIV = Buffer.from(cipherEncoded, "base64");
  const encryptedSalt = Buffer.from(result.encrypted_salt!, "base64");

  const iv = cipherWithIV.subarray(0, IV_SIZE);
  const cipher = cipherWithIV.subarray(IV_SIZE);

  return await kemDecrypt({
    privateKey,
    cipher,
    iv: iv,
    password,
    encryptedSalt,
    symmetricAlgorithm: result.symmetric_algorithm!,
    asymmetricAlgorithm: result.asymmetric_algorithm!,
    kdf: result.kdf!,
    iterationCount: result.iteration_count!,
    hashAlgorithm: result.hash_algorithm!,
  });
}
