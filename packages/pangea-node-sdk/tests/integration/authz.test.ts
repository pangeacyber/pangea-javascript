import PangeaConfig from "../../src/config.js";
import AuthZService from "../../src/services/authz.js";
import { it, expect, jest } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils.js";
import { loadTestEnvironment } from "./utils.js";

jest.setTimeout(30000);

const environment = loadTestEnvironment("authz", TestEnvironment.LIVE);
const token = getTestToken(environment);
const domain = getTestDomain(environment);
const config = new PangeaConfig({ domain: domain, customUserAgent: "sdk-test" });
const authz = new AuthZService(token, config);

const TIME = Math.round(Date.now() / 1000);
const namespace_folder = "folder";
const namespace_user = "user";
const folder1 = "folder_1_" + TIME;
const folder2 = "folder_2_" + TIME;
const user1 = "user_1_" + TIME;
const user2 = "user_2_" + TIME;
const relation_owner = "owner";
const relation_editor = "editor";
const relation_reader = "reader";

it("AuthZ cycle", async () => {
  // Create tuples
  const rCreate = await authz.tuple_create({
    tuples: [
      {
        resource: {
          namespace: namespace_folder,
          id: folder1,
        },
        relation: relation_reader,
        subject: {
          namespace: namespace_user,
          id: user1,
        },
      },
      {
        resource: {
          namespace: namespace_folder,
          id: folder1,
        },
        relation: relation_editor,
        subject: {
          namespace: namespace_user,
          id: user2,
        },
      },
      {
        resource: {
          namespace: namespace_folder,
          id: folder2,
        },
        relation: relation_editor,
        subject: {
          namespace: namespace_user,
          id: user1,
        },
      },
      {
        resource: {
          namespace: namespace_folder,
          id: folder2,
        },
        relation: relation_owner,
        subject: {
          namespace: namespace_user,
          id: user2,
        },
      },
    ],
  });

  expect(rCreate.result).toStrictEqual({});

  // Tuple list with resource
  const rListWithResource = await authz.tuple_list({
    filter: {
      resource_namespace: namespace_folder,
      resource_id: folder1,
    },
  });

  expect(rListWithResource.result).toBeDefined();
  expect(rListWithResource.result.tuples.length).toBe(2);
  expect(rListWithResource.result.count).toBe(2);

  // Tuple list with subject
  const tListWithSubject = await authz.tuple_list({
    filter: {
      subject_namespace: namespace_user,
      subject_id: user1,
    },
  });

  expect(tListWithSubject.result).toBeDefined();
  expect(tListWithSubject.result.tuples.length).toBe(2);
  expect(tListWithSubject.result.count).toBe(2);

  // Tuple delete
  const rDelete = await authz.tuple_delete({
    tuples: [
      {
        resource: {
          namespace: namespace_folder,
          id: folder1,
        },
        relation: relation_reader,
        subject: {
          namespace: namespace_user,
          id: user1,
        },
      },
    ],
  });
  expect(rDelete.result).toStrictEqual({});

  // Check no debug
  let rCheck = await authz.check({
    resource: {
      namespace: namespace_folder,
      id: folder1,
    },
    action: "reader",
    subject: {
      namespace: namespace_user,
      id: user2,
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
      namespace: namespace_folder,
      id: folder1,
    },
    action: "editor",
    subject: {
      namespace: namespace_user,
      id: user2,
    },
    debug: true,
  });
  expect(rCheck.result).toBeDefined();
  expect(rCheck.result.allowed).toBeTruthy();
  expect(rCheck.result.debug).toBeDefined();
  expect(rCheck.result.schema_id).toBeDefined();
  expect(rCheck.result.schema_version).toBeDefined();

  // List resources
  const rListResources = await authz.list_resources({
    namespace: namespace_folder,
    action: relation_editor,
    subject: {
      namespace: namespace_user,
      id: user2,
    },
  });

  expect(rListResources.result).toBeDefined();
  expect(rListResources.result.ids.length).toBe(1);

  // List subjects
  const rListSubjects = await authz.list_subjects({
    resource: {
      namespace: namespace_folder,
      id: folder2,
    },
    action: relation_editor,
  });

  expect(rListSubjects.result).toBeDefined();
  expect(rListSubjects.result.subjects.length).toBe(1);
});
