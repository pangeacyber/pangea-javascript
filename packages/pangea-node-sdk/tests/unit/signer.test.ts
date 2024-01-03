import { Signer, Verifier } from "@src/utils/signer.js";
import { it, expect } from "@jest/globals";
import { Vault } from "@src/types.js";

it("Signer sign and verify successful", async () => {
  const privateKeyFilename = "./tests/testdata/privkey";
  const s = new Signer(privateKeyFilename);

  const pubKey = s.getPublicKey();
  const algorithm = s.getAlgorithm();
  const data = "Hello signed world";
  const signature = s.sign(data);

  expect(pubKey).toBe(
    "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAlvOyDMpK2DQ16NI8G41yINl01wMHzINBahtDPoh4+mE=\n-----END PUBLIC KEY-----\n"
  );
  expect(signature).toBe(
    "IYmIUBKWu5yLHM1u3bAw7dvVg1MPc7FLDWSz6d9oqn4FoCu9Bk6ta/lXvvXZUpa7hCm6RhU0VdBzh53x3mKiDQ=="
  );
  expect(algorithm).toBe(Vault.AsymmetricAlgorithm.Ed25519);

  const v = new Verifier();
  const result = v.verify(data, signature, pubKey);
  expect(result).toBe(true);
});

it("Verify old public key format successful", async () => {
  const pubKey = "lvOyDMpK2DQ16NI8G41yINl01wMHzINBahtDPoh4+mE=";
  const data = "Hello signed world";
  const signature =
    "IYmIUBKWu5yLHM1u3bAw7dvVg1MPc7FLDWSz6d9oqn4FoCu9Bk6ta/lXvvXZUpa7hCm6RhU0VdBzh53x3mKiDQ==";

  const v = new Verifier();
  const result = v.verify(data, signature, pubKey);
  expect(result).toBe(true);
});

it("Signer file does not exist", () => {
  const privateKeyFilename = "./this/is/not/a/file";
  expect(() => new Signer(privateKeyFilename)).toThrowErrorMatchingSnapshot();
});
