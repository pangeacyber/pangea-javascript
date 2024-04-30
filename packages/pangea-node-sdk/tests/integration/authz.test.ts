import PangeaConfig from "../../src/config.js";
import AuthZService from "../../src/services/authz.js";
import { it, expect, jest } from "@jest/globals";
import {
  TestEnvironment,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { loadTestEnvironment } from "./utils.js";

jest.setTimeout(30000);

const environment = loadTestEnvironment("authz", TestEnvironment.LIVE);
const token = getTestToken(environment);
const domain = getTestDomain(environment);
const config = new PangeaConfig({
  domain: domain,
  customUserAgent: "sdk-test",
});
const authz = new AuthZService(token, config);

const CURRENT_TIME_IN_SECONDS = Math.round(Date.now() / 1000);
const TYPE_FOLDER = "folder";
const TYPE_USER = "user";
const FOLDER_1 = "folder_1_" + CURRENT_TIME_IN_SECONDS;
const FOLDER_2 = "folder_2_" + CURRENT_TIME_IN_SECONDS;
const USER_1 = "user_1_" + CURRENT_TIME_IN_SECONDS;
const USER_2 = "user_2_" + CURRENT_TIME_IN_SECONDS;
const RELATION_OWNER = "owner";
const RELATION_EDITOR = "editor";
const RELATION_READER = "reader";

it("AuthZ cycle", async () => {
  // Create tuples
  const rCreate = await authz.tupleCreate({
    tuples: [
      {
        resource: {
          type: TYPE_FOLDER,
          id: FOLDER_1,
        },
        relation: RELATION_READER,
        subject: {
          type: TYPE_USER,
          id: USER_1,
        },
      },
      {
        resource: {
          type: TYPE_FOLDER,
          id: FOLDER_1,
        },
        relation: RELATION_EDITOR,
        subject: {
          type: TYPE_USER,
          id: USER_2,
        },
      },
      {
        resource: {
          type: TYPE_FOLDER,
          id: FOLDER_2,
        },
        relation: RELATION_EDITOR,
        subject: {
          type: TYPE_USER,
          id: USER_1,
        },
      },
      {
        resource: {
          type: TYPE_FOLDER,
          id: FOLDER_2,
        },
        relation: RELATION_OWNER,
        subject: {
          type: TYPE_USER,
          id: USER_2,
        },
      },
    ],
  });

  expect(rCreate.result).toStrictEqual({});

  // Tuple list with resource
  const rListWithResource = await authz.tupleList({
    filter: {
      resource_namespace: TYPE_FOLDER,
      resource_id: FOLDER_1,
    },
  });

  expect(rListWithResource.result).toBeDefined();
  expect(rListWithResource.result.tuples.length).toBe(2);
  expect(rListWithResource.result.count).toBe(2);

  // Tuple list with subject
  const tListWithSubject = await authz.tupleList({
    filter: {
      subject_namespace: TYPE_USER,
      subject_id: USER_1,
    },
  });

  expect(tListWithSubject.result).toBeDefined();
  expect(tListWithSubject.result.tuples.length).toBe(2);
  expect(tListWithSubject.result.count).toBe(2);

  // Tuple delete
  const rDelete = await authz.tupleDelete({
    tuples: [
      {
        resource: {
          type: TYPE_FOLDER,
          id: FOLDER_1,
        },
        relation: RELATION_READER,
        subject: {
          type: TYPE_USER,
          id: USER_1,
        },
      },
    ],
  });
  expect(rDelete.result).toStrictEqual({});

  // Check no debug
  let rCheck = await authz.check({
    resource: {
      type: TYPE_FOLDER,
      id: FOLDER_1,
    },
    action: "reader",
    subject: {
      type: TYPE_USER,
      id: USER_2,
    },
  });
  expect(rCheck.result).toBeDefined();
  expect(rCheck.result.allowed).toBeFalsy();
  expect(rCheck.result.debug).toBeUndefined();
  expect(rCheck.result.schema_id).toBeDefined();
  expect(rCheck.result.schema_version).toBeDefined();

  // Check debug
  rCheck = await authz.check({
    resource: {
      type: TYPE_FOLDER,
      id: FOLDER_1,
    },
    action: "editor",
    subject: {
      type: TYPE_USER,
      id: USER_2,
    },
    debug: true,
  });
  expect(rCheck.result).toBeDefined();
  expect(rCheck.result.allowed).toBeTruthy();
  expect(rCheck.result.debug).toBeDefined();
  expect(rCheck.result.schema_id).toBeDefined();
  expect(rCheck.result.schema_version).toBeDefined();

  // List resources
  const rListResources = await authz.listResources({
    type: TYPE_FOLDER,
    action: RELATION_EDITOR,
    subject: {
      type: TYPE_USER,
      id: USER_2,
    },
  });

  expect(rListResources.result).toBeDefined();
  expect(rListResources.result.ids.length).toBe(1);

  // List subjects
  const rListSubjects = await authz.listSubjects({
    resource: {
      type: TYPE_FOLDER,
      id: FOLDER_2,
    },
    action: RELATION_EDITOR,
  });

  expect(rListSubjects.result).toBeDefined();
  expect(rListSubjects.result.subjects.length).toBe(1);
});
