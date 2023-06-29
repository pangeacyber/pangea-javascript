import PangeaConfig from "../../src/config";
import AuthNService from "../../src/services/authn";
import { it, expect, jest } from "@jest/globals";
import { PangeaErrors } from "../../src/errors";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";
import { AuthN } from "../../src/types";

const environment = TestEnvironment.LIVE;
const token = getTestToken(environment);
const testHost = getTestDomain(environment);

const config = new PangeaConfig({ domain: testHost });
const authn = new AuthNService(token, config);

const RANDOM_VALUE = new Date().getTime().toString();
const EMAIL_TEST = `user.email+test${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_DELETE = `user.email+delete${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_DELETE = `user.email+invite_del${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_KEEP = `user.email+invite_keep${RANDOM_VALUE}@pangea.cloud`;
const PASSWORD_OLD = "My1s+Password";
const PASSWORD_NEW = "My1s+Password_new";
const PROFILE_OLD = { name: "User name", country: "Argentina" };
const PROFILE_NEW = { age: "18" };
let USER_ID; // Will be set once user is created

jest.setTimeout(60000);
it("User actions test", async () => {
  // Create
  const createResp = await authn.user.create(EMAIL_TEST, PASSWORD_OLD, AuthN.IDProvider.PASSWORD);
  expect(createResp.status).toBe("Success");
  expect(createResp.result.id).toBeDefined();
  expect(createResp.result.profile).toStrictEqual({});
  USER_ID = createResp.result.id;

  // Create 2
  const createResp2 = await authn.user.create(
    EMAIL_DELETE,
    PASSWORD_OLD,
    AuthN.IDProvider.PASSWORD,
    { profile: PROFILE_NEW }
  );
  expect(createResp2.status).toBe("Success");
  expect(createResp2.result.id).toBeDefined();
  expect(createResp2.result.profile).toStrictEqual(PROFILE_NEW);

  // Delete
  const deleteResp = await authn.user.delete({ email: EMAIL_DELETE });
  expect(deleteResp.status).toBe("Success");
  expect(deleteResp.result).toStrictEqual({});

  // Login
  let loginResp = await authn.user.login.password(EMAIL_TEST, PASSWORD_OLD);
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  let userToken = loginResp.result.active_token?.token || "";

  // Verify
  const verifyResp = await authn.user.verify(AuthN.IDProvider.PASSWORD, EMAIL_TEST, PASSWORD_OLD);
  expect(verifyResp.status).toBe("Success");

  // Update password
  const passUpdateResp = await authn.client.password.change(userToken, PASSWORD_OLD, PASSWORD_NEW);
  expect(passUpdateResp.status).toBe("Success");
  expect(passUpdateResp.result).toStrictEqual({});

  // Reset password
  const passResetResp = await authn.user.password.reset({
    user_id: USER_ID,
    new_password: PASSWORD_NEW,
  });
  expect(passResetResp.status).toBe("Success");

  // Get profile by email
  let getResp = await authn.user.profile.getProfile({ email: EMAIL_TEST });
  expect(getResp.status).toBe("Success");
  expect(getResp.result.profile).toStrictEqual({});
  expect(getResp.result.id).toBe(USER_ID);
  expect(getResp.result.email).toBe(EMAIL_TEST);
  expect(getResp.result.profile).toStrictEqual({});

  // Get profile by id
  getResp = await authn.user.profile.getProfile({ id: USER_ID });
  expect(getResp.status).toBe("Success");
  expect(getResp.result.profile).toStrictEqual({});
  expect(getResp.result.id).toBe(USER_ID);
  expect(getResp.result.email).toBe(EMAIL_TEST);
  expect(getResp.result.profile).toStrictEqual({});

  // Update profile
  const updateResp = await authn.user.profile.update({ email: EMAIL_TEST, profile: PROFILE_OLD });
  expect(updateResp.status).toBe("Success");
  expect(updateResp.result.id).toBe(USER_ID);
  expect(updateResp.result.email).toBe(EMAIL_TEST);
  expect(updateResp.result.profile).toStrictEqual(PROFILE_OLD);

  // Add one new field to profile
  const updateResp2 = await authn.user.profile.update({
    id: USER_ID,
    profile: PROFILE_NEW,
  });
  expect(updateResp2.status).toBe("Success");
  expect(updateResp2.result.id).toBe(USER_ID);
  expect(updateResp2.result.email).toBe(EMAIL_TEST);
  let finalProfile = { ...PROFILE_OLD };
  Object.assign(finalProfile, PROFILE_NEW);
  expect(updateResp2.result.profile).toStrictEqual(finalProfile);

  // Check token
  const checkResp = await authn.client.clientToken.check(userToken);
  expect(checkResp.status).toBe("Success");

  // Refresh
  loginResp = await authn.client.session.refresh(loginResp.result.refresh_token.token, {
    user_token: userToken,
  });
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // Client session logout
  let logoutResp = await authn.client.session.logout(userToken);
  expect(logoutResp.status).toBe("Success");

  // New login
  loginResp = await authn.user.login.password(EMAIL_TEST, PASSWORD_NEW);
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // Session logout
  logoutResp = await authn.session.logout(userToken);
  expect(logoutResp.status).toBe("Success");

  // New login
  loginResp = await authn.user.login.password(EMAIL_TEST, PASSWORD_NEW);
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // List sessions
  let listSessionsResp = await authn.session.list();
  expect(listSessionsResp.status).toBe("Success");
  expect(listSessionsResp.result.sessions.length).toBeGreaterThan(0);

  // Invalite sessions
  listSessionsResp.result.sessions.forEach((session) => {
    try {
      authn.session.invalidate(session.id);
    } catch (e) {
      console.log(`Failed to invalidate session_id[${session.id}]`);
      e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    }
  });

  // new login
  loginResp = await authn.user.login.password(EMAIL_TEST, PASSWORD_NEW);
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  userToken = loginResp.result.active_token?.token || "";

  // List client sessions
  listSessionsResp = await authn.client.session.list(userToken);
  expect(listSessionsResp.status).toBe("Success");
  expect(listSessionsResp.result.sessions.length).toBeGreaterThan(0);

  // Invalite sessions
  listSessionsResp.result.sessions.forEach((session) => {
    try {
      authn.client.session.invalidate(userToken, session.id);
    } catch (e) {
      console.log(`Failed to invalidate session_id[${session.id}] token[${userToken}]`);
      e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    }
  });

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
      e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    }
  });
});

it("Invite actions test", async () => {
  try {
    // Invite
    const inviteResp = await authn.user.invite(
      EMAIL_TEST,
      EMAIL_INVITE_KEEP,
      "/login-success",
      "somestate"
    );
    expect(inviteResp.status).toBe("Success");
    expect(inviteResp.result.inviter).toBe(EMAIL_TEST);

    const inviteResp2 = await authn.user.invite(
      EMAIL_TEST,
      EMAIL_INVITE_DELETE,
      "/login-success",
      "somestate"
    );
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
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    expect(false).toBeTruthy();
  }
});
