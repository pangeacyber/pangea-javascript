import { it, expect } from "@jest/globals";
import { hashSHA1, hashSHA256, getHashPrefix, strToB64, b64toStr, hashNTLM } from "@src/index.js";

it("Hash functions", async () => {
  const msg = "texttohash";

  expect(hashSHA256(msg)).toBe("d80cb0aae262f2b06bacc163f483fae428b8b282471b9c8e337e40992dd65c2c");
  expect(hashSHA1(msg)).toBe("53d7223d32f18504cd22de99647a6b5eab0c530c");
});

it("Hash functions", async () => {
  const hash = "123456789";

  expect(getHashPrefix(hash)).toBe("12345");
  expect(getHashPrefix(hash, 3)).toBe("123");
});

it("Base 64 strings", async () => {
  const msg = "texttoconvert";
  const msgB64 = strToB64(msg);
  const msgRecovered = b64toStr(msgB64);

  expect(msgRecovered).toBe(msg);
});

it("hashNTLM test", async () => {
  const msg = "password";
  const hash = hashNTLM(msg);
  expect(hash).toBe("8846F7EAEE8FB117AD06BDD830B7586C");
});
