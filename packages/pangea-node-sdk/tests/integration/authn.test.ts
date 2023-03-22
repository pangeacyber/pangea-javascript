import PangeaConfig from "../../src/config";
import AuthNService from "../../src/services/authn";
import { it, expect, jest } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";
import { AuthN } from "../../src/types";

const environmet = TestEnvironment.DEVELOP;
const token = getTestToken(environmet);
const testHost = getTestDomain(environmet);
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
let USER_IDENTITY; // Will be set once user is created

jest.setTimeout(20000);
it("User actions test", async () => {
  // Create
  const createResp = await authn.user.create(EMAIL_TEST, PASSWORD_OLD, AuthN.IDProvider.PASSWORD);
  expect(createResp.status).toBe("Success");
  expect(createResp.result.identity).toBeDefined();
  expect(createResp.result.profile).toStrictEqual({});
  USER_IDENTITY = createResp.result.identity;

  // Create 2
  const createResp2 = await authn.user.create(
    EMAIL_DELETE,
    PASSWORD_OLD,
    AuthN.IDProvider.PASSWORD,
    { profile: PROFILE_NEW }
  );
  expect(createResp2.status).toBe("Success");
  expect(createResp2.result.identity).toBeDefined();
  expect(createResp2.result.profile).toStrictEqual(PROFILE_NEW);

  // Delete
  const deleteResp = await authn.user.delete(EMAIL_DELETE);
  expect(deleteResp.status).toBe("Success");
  expect(deleteResp.result).toStrictEqual({});

  // Update password
  const passUpdateResp = await authn.password.update(EMAIL_TEST, PASSWORD_OLD, PASSWORD_NEW);
  expect(passUpdateResp.status).toBe("Success");
  expect(passUpdateResp.result).toStrictEqual({});

  // Login
  const loginResp = await authn.user.login.password(EMAIL_TEST, PASSWORD_NEW);
  expect(loginResp.status).toBe("Success");
  expect(loginResp.result.active_token).toBeDefined();
  expect(loginResp.result.refresh_token).toBeDefined();

  // Get profile by email
  let getResp = await authn.user.profile.getProfile({ email: EMAIL_TEST });
  expect(getResp.status).toBe("Success");
  expect(getResp.result.profile).toStrictEqual({});
  expect(getResp.result.identity).toBe(USER_IDENTITY);
  expect(getResp.result.email).toBe(EMAIL_TEST);
  expect(getResp.result.profile).toStrictEqual({});

  // Get profile by identity
  getResp = await authn.user.profile.getProfile({ identity: USER_IDENTITY });
  expect(getResp.status).toBe("Success");
  expect(getResp.result.profile).toStrictEqual({});
  expect(getResp.result.identity).toBe(USER_IDENTITY);
  expect(getResp.result.email).toBe(EMAIL_TEST);
  expect(getResp.result.profile).toStrictEqual({});

  // Update profile
  const updateResp = await authn.user.profile.update({ email: EMAIL_TEST, profile: PROFILE_OLD });
  expect(updateResp.status).toBe("Success");
  expect(updateResp.result.identity).toBe(USER_IDENTITY);
  expect(updateResp.result.email).toBe(EMAIL_TEST);
  expect(updateResp.result.profile).toStrictEqual(PROFILE_OLD);

  // Add one new field to profile
  const updateResp2 = await authn.user.profile.update({
    identity: USER_IDENTITY,
    profile: PROFILE_NEW,
  });
  expect(updateResp2.status).toBe("Success");
  expect(updateResp2.result.identity).toBe(USER_IDENTITY);
  expect(updateResp2.result.email).toBe(EMAIL_TEST);
  let finalProfile = { ...PROFILE_OLD };
  Object.assign(finalProfile, PROFILE_NEW);
  expect(updateResp2.result.profile).toStrictEqual(finalProfile);
});

jest.setTimeout(20000);
it("User actions test", async () => {
  // Invite
  const inviteResp = await authn.user.invite(
    EMAIL_TEST,
    EMAIL_INVITE_KEEP,
    "https://someurl.com/callbacklink",
    "somestate"
  );
  expect(inviteResp.status).toBe("Success");
  expect(inviteResp.result.inviter).toBe(EMAIL_TEST);

  const inviteResp2 = await authn.user.invite(
    EMAIL_TEST,
    EMAIL_INVITE_DELETE,
    "https://someurl.com/callbacklink",
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

  const listResp2 = await authn.user.list({ scopes: [], glob_scopes: [] });
  expect(listResp2.status).toBe("Success");
  expect(listResp.result.invites.length).toBeGreaterThan(0);
});
