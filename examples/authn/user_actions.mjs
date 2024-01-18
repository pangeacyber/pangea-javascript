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
const PROFILE_INITIAL = { first_name: "Name", last_name: "User" };
const PROFILE_UPDATE = { first_name: "NameUpdate" };
const CB_URI = "https://www.usgs.gov/faqs/what-was-pangea"; // Need to setup callbacks in PUC AuthN settings
let USER_ID; // This will be set once user is created

async function flowHandlePasswordPhase(authn, flow_id, password) {
  console.log("Update flow with password");
  const response = await authn.flow.update({
    flow_id: flow_id,
    choice: AuthN.Flow.Choice.PASSWORD,
    data: {
      password: password,
    },
  });
  return response.result;
}

async function flowHandleProfilePhase(authn, flow_id) {
  console.log("Update flow with profile");
  const response = await authn.flow.update({
    flow_id,
    choice: AuthN.Flow.Choice.PROFILE,
    data: {
      profile: PROFILE_INITIAL,
    },
  });
  return response.result;
}

async function flowHandleAgreementsPhase(authn, result, flow_id) {
  console.log("Update flow with agreements");
  let agreed = [];
  result.flow_choices.forEach((fc) => {
    if (fc.choice == AuthN.Flow.Choice.AGREEMENTS) {
      const agreements =
        typeof fc.data["agreements"] === "object" ? fc.data["agreements"] : {};
      for (let [_, value] of Object.entries(agreements)) {
        if (typeof value === "object" && typeof value["id"] === "string") {
          agreed.push(value["id"]);
        }
      }
    }
  });

  const response = await authn.flow.update({
    flow_id,
    choice: AuthN.Flow.Choice.AGREEMENTS,
    data: {
      agreed: agreed,
    },
  });

  return response.result;
}

function choiceIsAvailable(result, choice) {
  let filter = result.flow_choices.filter(function (fc) {
    return fc.choice === choice;
  });

  return filter.length > 0;
}

(async () => {
  try {
    // Create
    console.log("Creating user...");
    console.log("Start flow by signing up and signing in");
    const startResp = await authn.flow.start({
      email: USER_EMAIL,
      flow_types: [AuthN.FlowType.SIGNUP, AuthN.FlowType.SIGNIN],
      cb_uri: CB_URI,
    });

    const flow_id = startResp.result.flow_id;
    let result = startResp.result;

    while (result.flow_phase != "phase_completed") {
      if (choiceIsAvailable(result, AuthN.Flow.Choice.PASSWORD)) {
        result = await flowHandlePasswordPhase(
          authn,
          flow_id,
          PASSWORD_INITIAL
        );
      } else if (choiceIsAvailable(result, AuthN.Flow.Choice.PROFILE)) {
        result = await flowHandleProfilePhase(authn, flow_id);
      } else if (choiceIsAvailable(result, AuthN.Flow.Choice.AGREEMENTS)) {
        result = await flowHandleAgreementsPhase(authn, result, flow_id);
      } else {
        console.log(`Phase ${result.flow_phase} not handled`);
        break;
      }
    }

    console.log("Complete signup/signin flow");
    const completeResp = await authn.flow.complete(flow_id);
    console.log("Flow is complete");

    const userToken = completeResp.result.active_token?.token || "";
    console.log("Login success. Result: ", completeResp.result);

    // Update password
    console.log("\n\nUpdate user password...");
    const _ = await authn.client.password.change(
      userToken,
      PASSWORD_INITIAL,
      PASSWORD_UPDATE
    );
    console.log("Update user password success.");

    // Get profile by email
    console.log("\n\nGetting profile by email...");
    let getResp = await authn.user.profile.getProfile({ email: USER_EMAIL });
    USER_ID = getResp.result.id;
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
    let listResp2 = await authn.user.list({});
    console.log(`List users success. ${listResp2.result.users.length} `);

    // Delete
    console.log("\n\nDelete user...");
    await authn.user.delete({ email: USER_EMAIL });
    console.log("Delete user success.");

    // List users
    console.log("\n\nList users...");
    listResp2 = await authn.user.list({});
    console.log(`List users success. ${listResp2.result.users.length} `);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log("Something went wrong...");
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
