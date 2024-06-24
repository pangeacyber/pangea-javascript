import PangeaConfig from "../../src/config.js";
import AuthNService from "../../src/services/authn/index.js";
import { it, expect, jest } from "@jest/globals";
import { PangeaErrors } from "../../src/errors.js";
import {
  TestEnvironment,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { AuthN } from "../../src/types.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("authn", TestEnvironment.LIVE);
const token = getTestToken(environment);
const testHost = getTestDomain(environment);

const config = new PangeaConfig({ domain: testHost });
const authn = new AuthNService(token, config);

const TIME = Math.round(Date.now() / 1000);
const EMAIL_TEST = `user.email+test${TIME}@pangea.cloud`;
const EMAIL_DELETE = `user.email+delete${TIME}@pangea.cloud`;
const PASSWORD_OLD = "My1s+Password";
// const PASSWORD_NEW = "My1s+Password_new";
const PROFILE_OLD = { first_name: "Name", last_name: "Last" };
const PROFILE_NEW = { first_name: "NameUpdate" };
const EMAIL_INVITE_DELETE = `user.email+invite_del${TIME}@pangea.cloud`;
const EMAIL_INVITE_KEEP = `user.email+invite_keep${TIME}@pangea.cloud`;
const CB_URI = "https://someurl.com/callbacklink";
let USER_ID; // Will be set once user is created

async function flowHandlePasswordPhase(
  authn: AuthNService,
  flow_id: string,
  password: string
): Promise<AuthN.Flow.UpdateResult> {
  const response = await authn.flow.update({
    flow_id: flow_id,
    choice: AuthN.Flow.Choice.PASSWORD,
    data: {
      password: password,
    },
  });
  return response.result;
}

async function flowHandleProfilePhase(
  authn: AuthNService,
  flow_id: string
): Promise<AuthN.Flow.UpdateResult> {
  const response = await authn.flow.update({
    flow_id,
    choice: AuthN.Flow.Choice.PROFILE,
    data: {
      profile: PROFILE_OLD,
    },
  });
  return response.result;
}

async function flowHandleAgreementsPhase(
  authn: AuthNService,
  result: AuthN.Flow.UpdateResult,
  flow_id: string
): Promise<AuthN.Flow.UpdateResult> {
  let agreed: string[] = [];
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

function choiceIsAvailable(
  result: AuthN.Flow.UpdateResult,
  choice: string
): boolean {
  let filter = result.flow_choices.filter(function (fc) {
    return fc.choice === choice;
  });

  return filter.length > 0;
}

async function login(
  email: string,
  password: string
): Promise<AuthN.Flow.CompleteResult> {
  const startResp = await authn.flow.start({
    email: email,
    cb_uri: CB_URI,
    flow_types: [AuthN.FlowType.SIGNIN],
  });

  await authn.flow.update({
    flow_id: startResp.result.flow_id,
    choice: AuthN.Flow.Choice.PASSWORD,
    data: {
      password: password,
    },
  });

  const completeResp = await authn.flow.complete(startResp.result.flow_id);
  return completeResp.result;
}

async function createAndLogin(
  email: string,
  password: string
): Promise<AuthN.Flow.CompleteResult> {
  const startResp = await authn.flow.start({
    email: email,
    flow_types: [AuthN.FlowType.SIGNUP, AuthN.FlowType.SIGNIN],
    cb_uri: CB_URI,
  });

  const flow_id = startResp.result.flow_id;
  let result = startResp.result;

  while (result.flow_phase != "phase_completed") {
    if (choiceIsAvailable(result, AuthN.Flow.Choice.PASSWORD)) {
      result = await flowHandlePasswordPhase(authn, flow_id, password);
    } else if (choiceIsAvailable(result, AuthN.Flow.Choice.PROFILE)) {
      result = await flowHandleProfilePhase(authn, flow_id);
    } else if (choiceIsAvailable(result, AuthN.Flow.Choice.AGREEMENTS)) {
      result = await flowHandleAgreementsPhase(authn, result, flow_id);
    } else {
      console.log(`Phase ${result.flow_phase} not handled`);
      break;
    }
  }

  const completeResp = await authn.flow.complete(flow_id);
  return completeResp.result;
}

jest.setTimeout(60000);
it("User actions test", async () => {
  let loginResult = await createAndLogin(EMAIL_TEST, PASSWORD_OLD);
  expect(loginResult.active_token).toBeDefined();

  await createAndLogin(EMAIL_DELETE, PASSWORD_OLD);

  // Get profile by email
  let getResp = await authn.user.profile.getProfile({ email: EMAIL_TEST });
  expect(getResp.status).toBe("Success");
  expect(getResp.result.profile).toStrictEqual(PROFILE_OLD);
  expect(getResp.result.id).toBeDefined();
  USER_ID = getResp.result.id;
  expect(getResp.result.email).toBe(EMAIL_TEST);

  // Get profile by id
  getResp = await authn.user.profile.getProfile({ id: USER_ID });
  expect(getResp.status).toBe("Success");
  expect(getResp.result.profile).toStrictEqual(PROFILE_OLD);
  expect(getResp.result.id).toBe(USER_ID);
  expect(getResp.result.email).toBe(EMAIL_TEST);

  // Update profile
  const updateResp = await authn.user.profile.update({
    email: EMAIL_TEST,
    profile: PROFILE_NEW,
  });
  expect(updateResp.status).toBe("Success");
  expect(updateResp.result.id).toBe(USER_ID);
  expect(updateResp.result.email).toBe(EMAIL_TEST);
  let finalProfile = { ...PROFILE_OLD };
  Object.assign(finalProfile, PROFILE_NEW);
  expect(updateResp.result.profile).toStrictEqual(finalProfile);

  // Check token
  let userToken = "";
  if (loginResult.active_token !== undefined) {
    userToken = loginResult.active_token.token;
  }
  const checkResp = await authn.client.clientToken.check(userToken);
  expect(checkResp.status).toBe("Success");

  // Refresh
  const loginResp = await authn.client.session.refresh(
    loginResult.refresh_token.token,
    {
      user_token: userToken,
    }
  );
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // Client session logout
  let logoutResp = await authn.client.session.logout(userToken);
  expect(logoutResp.status).toBe("Success");

  // New login
  loginResult = await login(EMAIL_TEST, PASSWORD_OLD);
  expect(loginResult.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // Session logout
  logoutResp = await authn.session.logout(userToken);
  expect(logoutResp.status).toBe("Success");

  // New login
  loginResult = await login(EMAIL_TEST, PASSWORD_OLD);
  expect(loginResult.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // List sessions
  let listSessionsResp = await authn.session.list();
  expect(listSessionsResp.status).toBe("Success");
  expect(listSessionsResp.result.sessions.length).toBeGreaterThan(0);

  // Invalidate sessions
  listSessionsResp.result.sessions.forEach((session) => {
    try {
      authn.session.invalidate(session.id);
    } catch (e) {
      console.log(`Failed to invalidate session_id[${session.id}]`);
      e instanceof PangeaErrors.APIError
        ? console.log(e.toString())
        : console.log(e);
    }
  });

  // New login
  loginResult = await login(EMAIL_TEST, PASSWORD_OLD);
  expect(loginResult.active_token).toBeDefined();
  expect(loginResult.refresh_token).toBeDefined();
  userToken = loginResult.active_token?.token || "";

  // List client sessions
  listSessionsResp = await authn.client.session.list(userToken);
  expect(listSessionsResp.status).toBe("Success");
  expect(listSessionsResp.result.sessions.length).toBeGreaterThan(0);

  // Invalidate sessions
  listSessionsResp.result.sessions.forEach((session) => {
    try {
      authn.client.session.invalidate(userToken, session.id);
    } catch (e) {
      console.log(
        `Failed to invalidate session_id[${session.id}] token[${userToken}]`
      );
      e instanceof PangeaErrors.APIError
        ? console.log(e.toString())
        : console.log(e);
    }
  });

  // Expire password.
  const expireResp = await authn.client.password.expire(USER_ID);
  expect(expireResp.status).toEqual("Success");

  // List users
  const listResp = await authn.user.list({});
  expect(listResp.status).toBe("Success");
  expect(listResp.result.users.length).toBeGreaterThan(0);

  // Delete users
  listResp.result.users.forEach((user) => {
    try {
      authn.user.delete({ id: user.id });
    } catch (e) {
      console.log("Failed to delete user id: ", user.id);
      e instanceof PangeaErrors.APIError
        ? console.log(e.toString())
        : console.log(e);
    }
  });
});

it("Invite actions test", async () => {
  try {
    // Invite
    const inviteResp = await authn.user.invite({
      inviter: EMAIL_TEST,
      email: EMAIL_INVITE_KEEP,
      callback: CB_URI,
      state: "somestate",
    });
    expect(inviteResp.status).toBe("Success");
    expect(inviteResp.result.inviter).toBe(EMAIL_TEST);

    const inviteResp2 = await authn.user.invite({
      inviter: EMAIL_TEST,
      email: EMAIL_INVITE_DELETE,
      callback: CB_URI,
      state: "somestate",
    });
    expect(inviteResp2.status).toBe("Success");
    expect(inviteResp2.result.inviter).toBe(EMAIL_TEST);

    // Delete invite
    const deleteResp = await authn.user.invites.delete(inviteResp2.result.id);
    expect(deleteResp.status).toBe("Success");
    expect(deleteResp.result).toStrictEqual({});

    const listResp = await authn.user.invites.list({
      order: AuthN.ItemOrder.ASC,
      order_by: AuthN.User.Invite.OrderBy.ID,
    });
    expect(listResp.status).toBe("Success");
    expect(listResp.result.invites.length).toBeGreaterThan(0);
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    expect(false).toBeTruthy();
  }
});

async function agreement_cycle(type: AuthN.Agreements.AgreementType) {
  const name = `${type}_${TIME}`;
  const text = "This is agreement text";
  const active = false;

  // Create agreement
  const createResp = await authn.agreements.create({
    type: type,
    name: name,
    text: text,
    active: active,
  });

  expect(createResp.result.type).toBe(type.toString());
  expect(createResp.result.name).toBe(name);
  expect(createResp.result.text).toBe(text);
  expect(createResp.result.active).toBe(active);
  const id = createResp.result.id;
  expect(id).toBeDefined();

  // Update
  const newName = `${name}_v2`;
  const newText = `${text} v2`;
  const updateResp = await authn.agreements.update({
    type: type,
    id: id,
    name: newName,
    text: newText,
  });

  expect(updateResp.result.type).toBe(type.toString());
  expect(updateResp.result.name).toBe(newName);
  expect(updateResp.result.text).toBe(newText);
  expect(updateResp.result.active).toBe(active);

  // List
  let listResp = await authn.agreements.list({});
  expect(listResp.result.count).toBeGreaterThan(0);
  expect(listResp.result.agreements.length).toBeGreaterThan(0);
  const count = listResp.result.count;

  // Delete
  await authn.agreements.delete({
    type: type,
    id: id,
  });

  // List again
  listResp = await authn.agreements.list({});
  expect(listResp.result.count).toBe(count - 1);
}

it("Test agreements cycle. EULA", async () => {
  try {
    await agreement_cycle(AuthN.Agreements.AgreementType.EULA);
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    expect(false).toBeTruthy();
  }
});

it("Test agreements cycle. Policy privacy", async () => {
  try {
    await agreement_cycle(AuthN.Agreements.AgreementType.PRIVACY_POLICY);
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    expect(false).toBeTruthy();
  }
});
