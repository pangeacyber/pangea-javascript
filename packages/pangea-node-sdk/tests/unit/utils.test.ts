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
import {
  canonicalize,
  canonicalizeEnvelope,
  getFileUploadParams,
} from "@src/utils/utils.js";
import { verifyLogHash } from "@src/utils/verification.js";

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

it("PAN-15851: canonicalization escaping", () => {
  // It's easier to read the expected outputs if we don't have to escape
  // quotes to satisfy the quotes lint.
  /* eslint-disable quotes */
  expect(canonicalize({ foo: "'" })).toEqual(`{"foo":"'"}`);
  expect(canonicalize({ foo: "`" })).toEqual('{"foo":"`"}');
  expect(canonicalize({ foo: `"` })).toEqual('{"foo":"\\""}');
  expect(canonicalize({ foo: "❤️" })).toEqual('{"foo":"\u2764\ufe0f"}');
  expect(canonicalize({ foo: "𝌆" })).toEqual('{"foo":"\ud834\udf06"}');
  expect(canonicalize({ foo: "abc𝔸𝔹ℂ" })).toEqual(
    '{"foo":"abc\ud835\udd38\ud835\udd39\u2102"}'
  );
  /* eslint-enable quotes */

  const envelope = {
    received_at: "2024-07-25T00:51:46.340938Z",
    event: {
      action: "Viewed employee records",
      actor: "rob",
      message: "rob viewed Oliver Friedrichs employee details.",
      new: '{"image":"/people/Oliver_Friedrichs.png","linkedin":"https://www.linkedin.com/in/oliverfriedrichs","name":"Oliver Friedrichs","quote":["I \\u2764\\ufe0f SOC2, GDPR, HIPAA, PCI and ISO 27001.","Always give 100%, unless you\'re donating blood.","If you think you are too small to make a difference, try sleeping with a mosquito."],"title":"CEO","twitter":""}',
    },
  };
  expect(
    verifyLogHash(
      envelope,
      "e43f028b3d824db1de9e709c652dc4377af0a6422f1248d5654ea42258a777ef"
    )
  ).toStrictEqual(true);
});

it("canon envelope dates", () => {
  const sample = { event: { custom: new Date("1995-12-17T03:24:00Z") } };
  expect(canonicalizeEnvelope(sample)).toEqual(
    '{"event":{"custom":"1995-12-17T03:24:00.000Z"}}'
  );
});

it("canon envelope nested objects", () => {
  const sample = {
    received_at: "2024-09-03T22:08:32.694255Z",
    event: {
      actor: "node-sdk",
      message: "JSON-message",
      new: { customtag3: "mycustommsg3", ct4: "cm4" },
      old: { customtag5: "mycustommsg5", ct6: "cm6" },
      status: "no-signed",
    },
  };
  expect(canonicalizeEnvelope(sample)).toEqual(
    '{"event":{"actor":"node-sdk","message":"JSON-message","new":"{\\"ct4\\":\\"cm4\\",\\"customtag3\\":\\"mycustommsg3\\"}","old":"{\\"ct6\\":\\"cm6\\",\\"customtag5\\":\\"mycustommsg5\\"}","status":"no-signed"},"received_at":"2024-09-03T22:08:32.694255Z"}'
  );
});

it("PAN-16573: canonicalize a-circumflex", () => {
  const envelope = {
    received_at: "2024-09-03T20:01:38.704822Z",
    event: { message: "â" },
  };
  expect(canonicalizeEnvelope(envelope)).toEqual(
    '{"event":{"message":"â"},"received_at":"2024-09-03T20:01:38.704822Z"}'
  );
  expect(
    verifyLogHash(
      envelope,
      "77bb9ccd63d232e6c440d03c088f4723b146047d1dfa301bd69b82723a19a6fb"
    )
  ).toStrictEqual(true);
});

it("PAN-16573: canonicalize a-circumflex + replacement character", () => {
  const envelope = {
    received_at: "2024-08-27T19:35:14.005407Z",
    event: { message: "â\uFFFD" },
  };
  expect(canonicalizeEnvelope(envelope)).toEqual(
    '{"event":{"message":"\u00e2\ufffd"},"received_at":"2024-08-27T19:35:14.005407Z"}'
  );
  expect(
    verifyLogHash(
      envelope,
      "2195d3522099699c949732d2449a45e490ec3818f69ca7c021232c03a1ba9798"
    )
  ).toStrictEqual(true);
});
