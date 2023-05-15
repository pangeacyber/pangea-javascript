/* eslint-disable no-console */

import { PangeaConfig, AuthNService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUTHN_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const authn = new AuthNService(token, config);
const RANDOM_VALUE = new Date().getTime().toString();
const EMAIL_INVITER = `inviter.email+test${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_1 = `invite_1.email+delete${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_2 = `invite_2.email+delete${RANDOM_VALUE}@pangea.cloud`;

(async () => {
  try {
    // Invite 1
    console.log("Invite user 1...");
    const inviteResp = await authn.user.invite(
      EMAIL_INVITER,
      EMAIL_INVITE_1,
      "https://someurl.com/callbacklink",
      "somestate"
    );
    console.log("Invite success. Result: ", inviteResp.result);

    // Invite 2
    console.log("\n\nInvite user 2...");
    const inviteResp2 = await authn.user.invite(
      EMAIL_INVITER,
      EMAIL_INVITE_2,
      "https://someurl.com/callbacklink",
      "somestate"
    );
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
