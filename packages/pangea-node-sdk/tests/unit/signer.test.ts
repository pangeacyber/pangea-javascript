import { Signer, Verifier } from "../../src/utils/signer.js";
import assert from "node:assert";

it("Signer sign and verify successful", async () => {
  const privateKeyFilename = "./tests/testdata/privkey";
  const s = new Signer(privateKeyFilename);

  const pubKey = s.getPublicKey();
  const data = "Hello signed world";
  const signature = s.sign(data);

  expect(pubKey).toBe("lvOyDMpK2DQ16NI8G41yINl01wMHzINBahtDPoh4+mE=");
  console.log("Public key base64 is: ", pubKey);
  console.log("Signature base64 is: ", signature);
  expect(signature).toBe(
    "IYmIUBKWu5yLHM1u3bAw7dvVg1MPc7FLDWSz6d9oqn4FoCu9Bk6ta/lXvvXZUpa7hCm6RhU0VdBzh53x3mKiDQ=="
  );

  const v = new Verifier();
  const result = v.verify(data, signature, pubKey);
  expect(result).toBe(true);
});

it("Signer file does not exist", async () => {
  const privateKeyFilename = "./this/is/not/a/file";
  // Verify error output:
  try {
    const s = new Signer(privateKeyFilename);
  } catch (err: any) {
    assert(err.code == "ENOENT");
  }
});
