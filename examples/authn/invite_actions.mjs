/* eslint-disable no-console */

import { PangeaConfig, AuthNService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUTHN_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});
const authn = new AuthNService(token, config);
const RANDOM_VALUE = new Date().getTime().toString();
const EMAIL_INVITER = `inviter.email+test${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_1 = `invite_1.email+delete${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_2 = `invite_2.email+delete${RANDOM_VALUE}@pangea.cloud`;
const CB_URI = "https://www.usgs.gov/faqs/what-was-pangea";

(async () => {
  try {
    // Invite 1
    console.log("Invite user 1...");
    const inviteResp = await authn.user.invite({
      inviter: EMAIL_INVITER,
      email: EMAIL_INVITE_1,
      callback: CB_URI,
      state: "somestate",
    });
    console.log("Invite success. Result: ", inviteResp.result);

    // Invite 2
    console.log("\n\nInvite user 2...");
    const inviteResp2 = await authn.user.invite({
      inviter: EMAIL_INVITER,
      email: EMAIL_INVITE_2,
      callback: CB_URI,
      state: "somestate",
    });
    console.log("Invite success. Result: ", inviteResp2.result);
    const invite_id_2 = inviteResp2.result.id;

    // List invites
    console.log("\n\nList invites...");
    const listResp = await authn.user.invites.list();
    console.log(`List success. ${listResp.result.invites.length} invites sent`);

    // Delete invite
    console.log("\n\nDelete invite...");
    const deleteResp = await authn.user.invites.delete(invite_id_2);
    console.log("Delete success.");

    console.log("\n\nList invites...");
    const listResp2 = await authn.user.invites.list();
    console.log(
      `List success. ${listResp2.result.invites.length} invites sent`
    );
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log("Something went wrong...");
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
