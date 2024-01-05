import PangeaConfig from "../../src/config.js";
import { it, expect, jest } from "@jest/globals";
import {
  TestEnvironment,
  getFileUploadParams,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { StoreService } from "../../src/index.js";
import { Store, TransferMethod } from "../../src/types.js";
import { StoreUploader } from "@src/services/store.js";

const testEnvironment = TestEnvironment.DEVELOP;
const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const client = new StoreService(token, config);

const TIME = Math.round(Date.now() / 1000);
const FOLDER_DELETE = "/sdk_tests/node/delete/" + TIME;
const FOLDER_FILES = "/sdk_tests/node/files/" + TIME;
const METADATA = { field1: "value1", field2: "value2" };
const ADD_METADATA = { field3: "value3" };
const TAGS = ["tag1", "tag2"];
const ADD_TAGS = ["tag3"];

const testfilePath = "./tests/testdata/testfile.pdf";
jest.setTimeout(120000);

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

xit("Folder create/delete", async () => {
  try {
    const respCreate = await client.folderCreate({
      path: FOLDER_DELETE,
    });
    expect(respCreate.success).toBeTruthy();
    expect(respCreate.result.object.id).toBeDefined();
    expect(respCreate.result.object.type).toBe("folder");
    expect(respCreate.result.object.name).toBeDefined();
    expect(respCreate.result.object.created_at).toBeDefined();
    expect(respCreate.result.object.updated_at).toBeDefined();

    const id = respCreate.result.object.id;
    const respDelete = await client.delete({
      id: id,
    });
    expect(respDelete.success).toBeTruthy();
    expect(respDelete.result.count).toBe(1);
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
  }
});

xit("Put file. Multipart transfer_method", async () => {
  try {
    const name = TIME + "_file_post_url";
    const respPut = await client.put(
      {
        name: name,
        transfer_method: TransferMethod.MULTIPART,
      },
      {
        file: testfilePath,
        name: name,
      }
    );
    expect(respPut.success).toBeTruthy();
    console.log(respPut.result);
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
  }
});

xit("Put file. post-url transfer_method", async () => {
  try {
    const name = TIME + "_file_post_url";
    const respPut = await client.put(
      {
        name: name,
        transfer_method: TransferMethod.POST_URL,
      },
      {
        file: testfilePath,
        name: name,
      }
    );
    expect(respPut.success).toBeTruthy();
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
  }
});

xit("get url and put upload", async () => {
  let response;
  const name = TIME + "_file_split_put_url";
  try {
    const request: Store.PutRequest = {
      transfer_method: TransferMethod.PUT_URL,
      name: name,
    };
    response = await client.requestUploadURL(request);
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
    throw e;
  }

  const url = response.accepted_result?.put_url || "";

  const uploader = new StoreUploader();
  await uploader.uploadFile(
    url,
    {
      file: testfilePath,
      name: "file",
    },
    {
      transfer_method: TransferMethod.PUT_URL,
    }
  );

  const maxRetry = 12;
  for (let retry = 0; retry < maxRetry; retry++) {
    try {
      // Wait until result could be ready
      await delay(10 * 1000);
      const request_id = response.request_id || "";
      response = await client.pollResult(request_id);
      expect(response.status).toBe("Success");
      break;
    } catch {
      expect(retry).toBeLessThan(maxRetry - 1);
    }
  }
});

xit("get url and post upload", async () => {
  let response;
  const name = TIME + "_file_split_post_url";
  try {
    const params = getFileUploadParams(testfilePath);

    const request: Store.PutRequest = {
      transfer_method: TransferMethod.POST_URL,
      name: name,
      crc32c: params.crc32c,
      sha256: params.sha256,
      size: params.size,
    };

    response = await client.requestUploadURL(request);
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
    throw e;
  }

  const url = response.accepted_result?.post_url || "";
  const file_details = response.accepted_result?.post_form_data;

  const uploader = new StoreUploader();
  await uploader.uploadFile(
    url,
    {
      file: testfilePath,
      name: name,
      file_details: file_details,
    },
    {
      transfer_method: TransferMethod.POST_URL,
    }
  );

  const maxRetry = 12;
  for (let retry = 0; retry < maxRetry; retry++) {
    try {
      // Wait until result could be ready
      await delay(10 * 1000);
      const request_id = response.request_id || "";
      response = await client.pollResult(request_id);
      expect(response.status).toBe("Success");
      break;
    } catch {
      expect(retry).toBeLessThan(maxRetry - 1);
    }
  }
});

it("get url and post upload", async () => {
  // Create a folder
  const respCreate = await client.folderCreate({
    path: FOLDER_FILES,
  });
  expect(respCreate.success).toBeTruthy();
  const folderID = respCreate.result.object.id;

  // # Upload a file with path as unique param
  const path1 = FOLDER_FILES + "/" + TIME + "_file_multipart_1";
  const respPutPath = await client.put(
    {
      path: path1,
      transfer_method: TransferMethod.MULTIPART,
    },
    {
      file: testfilePath,
      name: path1,
    }
  );

  expect(respPutPath.success).toBeTruthy();
  expect(respPutPath.result.object.parent_id).toBe(folderID);
  expect(respPutPath.result.object.metadata).toBeUndefined();
  expect(respPutPath.result.object.tags).toBeUndefined();
  expect(respPutPath.result.object.md5).toBeUndefined();
  expect(respPutPath.result.object.sha512).toBeUndefined();
  expect(respPutPath.result.object.sha256).toBeDefined();

  // Upload a file with parent id and name
  const name2 = TIME + "_file_multipart_2";
  const respPutId = await client.put(
    {
      parent_id: folderID,
      name: name2,
      transfer_method: TransferMethod.MULTIPART,
      metadata: METADATA,
      tags: TAGS,
    },
    {
      file: testfilePath,
      name: path1,
    }
  );

  expect(respPutId.success).toBeTruthy();
  expect(respPutId.result.object.parent_id).toBe(folderID);
  expect(respPutId.result.object.metadata).toStrictEqual(METADATA);
  expect(respPutId.result.object.tags).toStrictEqual(TAGS);
  expect(respPutId.result.object.sha256).toBeDefined();
  expect(respPutId.result.object.md5).toBeUndefined();
  expect(respPutId.result.object.sha512).toBeUndefined();

  // Update file. full metadata and tags
  const respUpdate = await client.update({
    id: respPutPath.result.object.id,
    metadata: METADATA,
    tags: TAGS,
  });
  expect(respUpdate.success).toBeTruthy();
  expect(respUpdate.result.object.metadata).toStrictEqual(METADATA);
  expect(respUpdate.result.object.tags).toStrictEqual(TAGS);

  // Update file. add metadata and tags
  const respUpdateAdd = await client.update({
    id: respPutPath.result.object.id,
    add_metadata: ADD_METADATA,
    add_tags: ADD_TAGS,
  });

  const metadataFinal = {
    ...METADATA,
    ...ADD_METADATA,
  };
  const tagsFinal = [...TAGS, ...ADD_TAGS];
  expect(respUpdateAdd.success).toBeTruthy();
  expect(respUpdateAdd.result.object.metadata).toStrictEqual(metadataFinal);
  expect(respUpdateAdd.result.object.tags).toStrictEqual(tagsFinal);

  // Get archive
  const respGetArchive1 = await client.getArchive({
    ids: [folderID],
    format: Store.ArchiveFormat.ZIP,
    transfer_method: TransferMethod.MULTIPART,
  });
  expect(respGetArchive1.success).toBeTruthy();
  expect(respGetArchive1.result.dest_url).toBeUndefined();
  expect(respGetArchive1.attachedFiles.length).toBe(1);
  respGetArchive1.attachedFiles.forEach((file) => {
    file.save("./");
  });

  const respGetArchive2 = await client.getArchive({
    ids: [folderID],
    format: Store.ArchiveFormat.TAR,
    transfer_method: TransferMethod.DEST_URL,
  });
  expect(respGetArchive2.success).toBeTruthy();
  expect(respGetArchive2.result.dest_url).toBeDefined();
  expect(respGetArchive2.attachedFiles.length).toBe(0);

  // Download file
  const url = respGetArchive2.result.dest_url ?? "";
  let downloadedFile = await client.downloadFile(url);
  expect(downloadedFile.file.length).toBeGreaterThan(0);

  // Create share link
  const authenticators: Store.Authenticator[] = [
    { auth_type: Store.AuthenticatorType.PASSWORD, auth_context: "somepassword" },
  ];
  const linkList: Store.ShareLinkCreateItem[] = [
    {
      targets: [folderID],
      link_type: Store.LinkType.ALL,
      max_access_count: 3,
      authenticators: authenticators,
    },
  ];

  const respCreateLink = await client.shareLinkCreate({
    links: linkList,
  });
  expect(respCreateLink.success).toBeTruthy();
  const links = respCreateLink.result.share_link_objects;
  expect(links.length).toBe(1);

  const link = links[0];
  expect(link).toBeDefined();
  expect(link?.access_count).toBe(0);
  expect(link?.max_access_count).toBe(3);
  expect(link?.authenticators.length).toBe(1);
  expect(link?.authenticators[0]?.auth_type).toBe(Store.AuthenticatorType.PASSWORD);
  expect(link?.link).toBeDefined();
  expect(link?.id).toBeDefined();
  expect(link?.targets.length).toBe(1);

  // Get share link
  const linkID = link?.id ?? "";
  const respGetLink = await client.shareLinkGet({
    id: linkID,
  });
  expect(respGetLink.success).toBeTruthy();
  expect(respGetLink.result.share_link_object.link).toBe(link?.link);
  expect(respGetLink.result.share_link_object.access_count).toBe(0);
  expect(respGetLink.result.share_link_object.max_access_count).toBe(3);
  expect(respGetLink.result.share_link_object.created_at).toBe(link?.created_at);
  expect(respGetLink.result.share_link_object.expires_at).toBe(link?.expires_at);

  // List share link
  const respListLink = await client.shareLinkList();
  expect(respListLink.success).toBeTruthy();
  expect(respListLink.result.count).toBeGreaterThan(0);
  expect(respListLink.result.share_link_objects.length).toBeGreaterThan(0);

  // Delete share link
  const respDeleteLink = await client.shareLinkDelete({
    ids: [linkID],
  });
  expect(respDeleteLink.success).toBeTruthy();
  expect(respDeleteLink.result.share_link_objects.length).toBe(1);

  // List files in folder
  const listFilter = {
    folder: FOLDER_FILES,
  };
  const respList = await client.list({
    filter: listFilter,
  });
  expect(respList.success).toBeTruthy();
  expect(respList.result.count).toBe(2);
  expect(respList.result.objects.length).toBe(2);
});
