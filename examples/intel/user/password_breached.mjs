/* eslint-disable no-console */

import {
  Intel,
  PangeaConfig,
  UserIntelService,
  PangeaErrors,
  hashSHA256,
  getHashPrefix,
} from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const userIntel = new UserIntelService(String(token), config);

(async () => {
  console.log("Checking password breached...");

  const options = { verbose: true, raw: true };
  try {
    // Set the password you would like to check
    // Observe proper safety with passwords, do not check them into source control etc.
    const password = "mypassword";
    // Calculate its hash, it could be sha256, sha512 or sha1
    const hash = hashSHA256(password);
    // get the hash prefix, just the first 5 characters
    const hashPrefix = getHashPrefix(hash);

    const response = await userIntel.passwordBreached(
      // should set the right hash_type here, sha256 or sha1
      Intel.HashType.SHA256,
      hashPrefix,
      options
    );

    // isPasswordBreached is a helper function that can simplify searching the response's raw data for the full hash
    const status = UserIntelService.isPasswordBreached(response, hash);
    if (status == Intel.User.Password.PasswordStatus.BREACHED) {
      console.log(`Password '${password}' has been breached`);
    } else if (status == Intel.User.Password.PasswordStatus.UNBREACHED) {
      console.log(`Password '${password}' has not been breached`);
    } else if (status == Intel.User.Password.PasswordStatus.INCONCLUSIVE) {
      console.log(
        `Not enough information to confirm if password '${password}' has been or has not been breached.`
      );
    } else {
      console.log(`Unknown status: ${status}`);
    }
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
