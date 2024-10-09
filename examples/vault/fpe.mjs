// This example demonstrates how to use Vault's format-preserving encryption (FPE)
// to encrypt and decrypt text without changing its length.

import process from "node:process";
import { PangeaConfig, VaultService, Vault } from "pangea-node-sdk";

// Set up a Pangea Vault client.
const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const vault = new VaultService(token, config);

(async () => {
  // Plain text that we'll encrypt.
  const plainText = "123-4567-8901";

  // Optional tweak string.
  const tweak = "MTIzMTIzMT==";

  // Generate an encryption key.
  const generated = await vault.symmetricGenerate({
    algorithm: Vault.SymmetricAlgorithm.AES256_FF3_1,
    purpose: Vault.KeyPurpose.FPE,
    name: `nodejs-fpe-example-${Date.now()}`,
  });
  const keyId = generated.result.id;

  // Encrypt the plain text.
  const encrypted = await vault.encryptTransform({
    id: keyId,
    plain_text: plainText,
    tweak,
    alphabet: Vault.TransformAlphabet.NUMERIC,
  });
  const encryptedText = encrypted.result.cipher_text;
  console.log(`Plain text: ${plainText}. Encrypted text: ${encryptedText}.`);

  // Decrypt the result to get back the text we started with.
  const decrypted = await vault.decryptTransform({
    id: keyId,
    cipher_text: encryptedText,
    tweak,
    alphabet: Vault.TransformAlphabet.NUMERIC,
  });
  const decryptedText = decrypted.result.plain_text;
  console.log(`Original text: ${plainText}. Decrypted text: ${decryptedText}.`);
})();
