import {
  KeyObject,
  createPrivateKey,
  createPublicKey,
  sign,
  verify,
} from "node:crypto";
import fs from "node:fs";

import { Vault } from "@src/types.js";
import { PangeaErrors } from "@src/errors.js";

const allowedKeyTypes = ["ed25519"];

/**
 * Signer class to sign event in AuditService
 */
export class Signer {
  privateKey: KeyObject;

  constructor(privateKeyFilename: string) {
    this.privateKey = createPrivateKey(fs.readFileSync(privateKeyFilename));
  }

  /**
   * @summary Sign data with private key and ED25519 algorithm
   * @description Fetch paginated results of a previously executed search
   * @param {String} data - data to be signed
   * @returns {string} - signature encoded in base64
   * @example
   * const signature = signer.sign("This is my message to sign")
   */
  sign(data: string): string {
    if (
      !this.privateKey.asymmetricKeyType ||
      !allowedKeyTypes.includes(this.privateKey.asymmetricKeyType)
    ) {
      throw new PangeaErrors.PangeaError(
        `Key type not supported: ${this.privateKey.asymmetricKeyType}`
      );
    }
    const bytes = Buffer.from(data);
    const signature = sign(null, bytes, this.privateKey);
    return signature.toString("base64");
  }

  /**
   * @summary Get public key of signer
   * @description create public key from signer's private key and return it
   * @returns {string} - public key encoded in base64
   * @example
   * const publicKey = signer.getPublicKey()
   */
  getPublicKey(): string {
    const pubKey = createPublicKey(this.privateKey);
    const pem = pubKey.export({ format: "pem", type: "spki" });
    return String(pem);
  }

  getAlgorithm(): string | null {
    switch (this.privateKey.asymmetricKeyType) {
      case "ed25519":
        return Vault.AsymmetricAlgorithm.Ed25519;
      default:
        return null;
    }
  }
}

/**
 * Verifier class to check event signature in AuditService
 */
export class Verifier {
  /**
   * @summary Verify signature data
   * @description Check if data and signature correspond with public key
   * @param {String} data - data to be verified
   * @param {String} signB64 - base64 encoded signature from data
   * @param {String} publicKeyInput - base64 encoded or pem data public key
   * @returns {String} - True if signature correspond with public key, false otherwise
   * @example
   * const result = verifier.verify("")
   */
  verify(data: string, signB64: string, publicKeyInput: string): boolean {
    let pubKey: KeyObject | undefined;
    const bytes = Buffer.from(data);
    const signBytes = Buffer.from(signB64, "base64");

    if (publicKeyInput.startsWith("-----")) {
      pubKey = createPublicKey(publicKeyInput);
    } else {
      const publicKeyB64urlSafe = Buffer.from(
        publicKeyInput,
        "base64"
      ).toString("base64url");
      const rawKey = {
        crv: "Ed25519",
        x: publicKeyB64urlSafe,
        kty: "OKP",
      };
      try {
        const pubKey = createPublicKey({
          key: rawKey,
          format: "jwk",
        });
        return verify(null, bytes, pubKey, signBytes);
      } catch {
        return false;
      }
    }

    return pubKey !== undefined
      ? verify(null, bytes, pubKey, signBytes)
      : false;
  }
}
