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
const EMAIL_TEST = `andres.tournour+test${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_DELETE = `andres.tournour+delete${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_DELETE = `andres.tournour+invite_del${RANDOM_VALUE}@pangea.cloud`;
const EMAIL_INVITE_KEEP = `andres.tournour+invite_keep${RANDOM_VALUE}@pangea.cloud`;
const PASSWORD_OLD = "My1s+Password";
const PASSWORD_NEW = "My1s+Password_new";
const PROFILE_OLD = { name: "User name", country: "Argentina" };
const PROFILE_NEW = { age: "18" };
let USER_ID; // Will be set once user is created

jest.setTimeout(20000);
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
  const loginResp = await authn.user.login.password(EMAIL_TEST, PASSWORD_OLD);
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();
  const userToken = loginResp.result.active_token?.token || "";

  // Update password
  const passUpdateResp = await authn.client.password.change(userToken, PASSWORD_OLD, PASSWORD_NEW);
  expect(passUpdateResp.status).toBe("Success");
  expect(passUpdateResp.result).toStrictEqual({});

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

  const listResp2 = await authn.user.list({});
  expect(listResp2.status).toBe("Success");
  expect(listResp2.result.users.length).toBeGreaterThan(0);
});

jest.setTimeout(20000);
it("Invite actions test", async () => {
  try {
    // Invite
    const inviteResp = await authn.user.invite(
      EMAIL_TEST,
      EMAIL_INVITE_KEEP,
      "https://someurl.com/login-success",
      "somestate"
    );
    expect(inviteResp.status).toBe("Success");
    expect(inviteResp.result.inviter).toBe(EMAIL_TEST);

    const inviteResp2 = await authn.user.invite(
      EMAIL_TEST,
      EMAIL_INVITE_DELETE,
      "https://someurl.com/login-success",
      "somestate"
    );
    expect(inviteResp2.status).toBe("Success");
    expect(inviteResp2.result.inviter).toBe(EMAIL_TEST);

    // Delete invite
    const deleteResp = await authn.user.invites.delete(inviteResp2.result.id);
    expect(deleteResp.status).toBe("Success");
    expect(deleteResp.result).toStrictEqual({});

    const listResp = await authn.user.invites.list();
    expect(listResp.status).toBe("Success");
    expect(listResp.result.invites.length).toBeGreaterThan(0);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    expect(false).toBeTruthy();
  }
});
