import { it, expect } from "@jest/globals";
import crc32c from "@node-rs/crc32";
import * as fs from "fs";
import { hashSHA1, hashSHA256, getHashPrefix, strToB64, b64toStr, hashNTLM } from "@src/index.js";
import { getFileUploadParams } from "@src/utils/utils.js";

const testfilePath = "./tests/testdata/testfile.pdf";

it("Hash functions", async () => {
  const msg = "texttohash";

  expect(hashSHA256(msg)).toBe("d80cb0aae262f2b06bacc163f483fae428b8b282471b9c8e337e40992dd65c2c");
  expect(hashSHA1(msg)).toBe("53d7223d32f18504cd22de99647a6b5eab0c530c");
});

it("Hash prefix", async () => {
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

it("CRC32C test", async () => {
  const msg = "ABCDEF";
  let crcValue = crc32c.crc32c(msg, 0) >>> 0;
  const crc = crcValue.toString(16);
  expect(crc).toBe("a4b7ce68");
});

it("getFileParams test filepath", async () => {
  const paramsFilepath = getFileUploadParams(testfilePath);
  expect(paramsFilepath.crc32c).toBe("754995fb");
  expect(paramsFilepath.sha256).toBe(
    "81655950d560e804a6315e09e74a7414e7b18ba99f722abe6122857e69a3aebd"
  );
  expect(paramsFilepath.size).toBe(10028);
});

it("getFileParams test buffer", async () => {
  const file = fs.readFileSync(testfilePath);
  const paramsFilepath = getFileUploadParams(file);

  expect(paramsFilepath.crc32c).toBe("754995fb");
  expect(paramsFilepath.sha256).toBe(
    "81655950d560e804a6315e09e74a7414e7b18ba99f722abe6122857e69a3aebd"
  );
  expect(paramsFilepath.size).toBe(10028);
});
