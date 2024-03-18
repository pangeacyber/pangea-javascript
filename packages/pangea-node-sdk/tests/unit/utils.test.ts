import fs from "node:fs/promises";

import { it, expect } from "@jest/globals";

import {
  hashSHA1,
  hashSHA256,
  getHashPrefix,
  strToB64,
  b64toStr,
  hashNTLM,
} from "@src/index.js";
import { getFileUploadParams } from "@src/utils/utils.js";

const testfilePath = "./tests/testdata/testfile.pdf";

it("Hash functions", () => {
  const msg = "texttohash";

  expect(hashSHA256(msg)).toBe(
    "d80cb0aae262f2b06bacc163f483fae428b8b282471b9c8e337e40992dd65c2c"
  );
  expect(hashSHA1(msg)).toBe("53d7223d32f18504cd22de99647a6b5eab0c530c");
});

it("Hash prefix", () => {
  const hash = "123456789";

  expect(getHashPrefix(hash)).toBe("12345");
  expect(getHashPrefix(hash, 3)).toBe("123");
});

it("Base 64 strings", () => {
  const msg = "texttoconvert";
  const msgB64 = strToB64(msg);
  const msgRecovered = b64toStr(msgB64);

  expect(msgRecovered).toBe(msg);
});

it("hashNTLM test", () => {
  const msg = "password";
  const hash = hashNTLM(msg);
  expect(hash).toBe("8846F7EAEE8FB117AD06BDD830B7586C");
});

it("getFileParams test filepath", () => {
  const paramsFilepath = getFileUploadParams(testfilePath);
  expect(paramsFilepath.crc32c).toBe("754995fb");
  expect(paramsFilepath.sha256).toBe(
    "81655950d560e804a6315e09e74a7414e7b18ba99f722abe6122857e69a3aebd"
  );
  expect(paramsFilepath.size).toBe(10028);
});

it("getFileParams test buffer", async () => {
  const file = await fs.readFile(testfilePath);
  const paramsFilepath = getFileUploadParams(file);

  expect(paramsFilepath.crc32c).toBe("754995fb");
  expect(paramsFilepath.sha256).toBe(
    "81655950d560e804a6315e09e74a7414e7b18ba99f722abe6122857e69a3aebd"
  );
  expect(paramsFilepath.size).toBe(10028);
});
