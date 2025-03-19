/* eslint-disable no-console */

import process from "node:process";

import { PangeaConfig, VaultService, Vault } from "pangea-node-sdk";

const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });
const vault = new VaultService(token, config);

(async () => {
  // First create an encryption key, either from the Pangea Console or
  // programmatically as below.
  const createResponse = await vault.symmetricGenerate({
    algorithm: Vault.SymmetricAlgorithm.AES256_CFB,
    purpose: Vault.KeyPurpose.ENCRYPTION,
    name: "Node.js encrypt example " + Date.now(),
  });
  const encryptionKeyId = createResponse.result.id;

  // Structured data that we'll encrypt.
  const data = {
    foo: [1, 2, "bar", "baz"],
    some: "thing",
  };

  const response = await vault.encryptStructured({
    id: encryptionKeyId,
    structured_data: data,
    filter: "$.foo[2:4]",
  });

  console.log(
    "Encrypted result: %s",
    JSON.stringify(response.result.structured_data, null, 2)
  );
})();
