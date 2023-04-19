/* eslint-disable no-console */

import {
  PangeaConfig,
  AuthNService,
  PangeaErrors,
  AuthN,
} from "pangea-node-sdk";

const token = process.env.PANGEA_AUTHN_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const authn = new AuthNService(token, config);
const RANDOM_VALUE = new Date().getTime().toString();
const USER_EMAIL = `user.email+test${RANDOM_VALUE}@pangea.cloud`;
const PASSWORD_INITIAL = "My1s+Password";
const PASSWORD_UPDATE = "My1s+Password_new";
const PROFILE_INITIAL = { name: "User name", country: "Argentina" };
const PROFILE_UPDATE = { age: "18" };
let USER_ID; // Will be set once user is created

(async () => {
  try {
    // Create
    console.log("Creating user...");
    const createResp = await authn.user.create(
      USER_EMAIL,
      PASSWORD_INITIAL,
      AuthN.IDProvider.PASSWORD,
      { profile: PROFILE_INITIAL }
    );
    console.log("Create user success. Result: ", createResp.result);
    USER_ID = createResp.result.id;

    // Login
    console.log("\n\nLogin...");
    const loginResp = await authn.user.login.password(
      USER_EMAIL,
      PASSWORD_INITIAL
    );
    const userToken = loginResp.result.active_token?.token || "";
    console.log("Login success. Result: ", loginResp.result);

    // Update password
    console.log("\n\nUpdate user password...");
    const passUpdateResp = await authn.client.password.change(
      userToken,
      PASSWORD_INITIAL,
      PASSWORD_UPDATE
    );
    console.log("Update user password success.");

    // Get profile by email
    console.log("\n\nGetting profile by email...");
    let getResp = await authn.user.profile.getProfile({ email: USER_EMAIL });
    console.log("Get profile success. Profile: ", getResp.result.profile);

    // Get profile by id
    console.log("\n\nGetting profile by id...");
    getResp = await authn.user.profile.getProfile({ id: USER_ID });
    console.log("Get profile success. Profile: ", getResp.result.profile);

    // Update profile
    console.log("\n\nUpdate profile...");
    const updateResp = await authn.user.profile.update({
      email: USER_EMAIL,
      profile: PROFILE_UPDATE,
    });
    console.log(
      "Update profile success. Current profile: ",
      updateResp.result.profile
    );

    // List users
    console.log("\n\nList users...");
    const listResp2 = await authn.user.list({});
    console.log(`List users success. ${listResp2.result.users.length} `);

    // Delete
    console.log("\n\nDelete user...");
    const deleteResp = await authn.user.delete({email: USER_EMAIL});
    console.log("Delete user success.");
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log("Something went wrong...");
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
