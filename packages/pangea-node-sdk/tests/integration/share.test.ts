import PangeaConfig from "../../src/config.js";
import { it, expect, jest } from "@jest/globals";
import {
  TestEnvironment,
  getFileUploadParams,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { ShareService, PangeaErrors } from "../../src/index.js";
import { Share, TransferMethod } from "../../src/types.js";
import { FileUploader } from "../../src/file_uploader.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("share", TestEnvironment.LIVE);
const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
});
const client = new ShareService(token, config);

const TIME = Math.round(Date.now() / 1000);
const FOLDER_DELETE = "/sdk_tests/node/delete/" + TIME;
const FOLDER_FILES = "/sdk_tests/node/files/" + TIME;
const METADATA = { field1: "value1", field2: "value2" };
const ADD_METADATA = { field3: "value3" };
const TAGS = ["tag1", "tag2"];
const ADD_TAGS = ["tag3"];

const testFilePath = "./tests/testdata/testfile.pdf";
const zeroBytesFilePath = "./tests/testdata/zerobytes.txt";
jest.setTimeout(120000);

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

it("Folder create/delete", async () => {
  const respCreate = await client.folderCreate({ folder: FOLDER_DELETE });
  expect(respCreate.success).toBeTruthy();
  expect(respCreate.result.object.id).toBeDefined();
  expect(respCreate.result.object.type).toBe("folder");
  expect(respCreate.result.object.name).toBeDefined();
  expect(respCreate.result.object.created_at).toBeDefined();
  expect(respCreate.result.object.updated_at).toBeDefined();

  const id = respCreate.result.object.id;
  const respDelete = await client.delete({ id: id });
  expect(respDelete.success).toBeTruthy();
  expect(respDelete.result.count).toBe(1);
});

it("Put file. Multipart transfer_method", async () => {
  try {
    const name = TIME + "_file_multipart";
    const respPut = await client.put(
      {
        name: name,
        transfer_method: TransferMethod.MULTIPART,
      },
      {
        file: testFilePath,
        name: name,
      }
    );
    expect(respPut.success).toBeTruthy();

    let respGet = await client.getItem({
      id: respPut.result.object.id,
      transfer_method: TransferMethod.MULTIPART,
    });

    expect(respGet.success).toBeTruthy();
    expect(respGet.result.dest_url).toBeUndefined();
    expect(respGet.attachedFiles.length).toBe(1);
    expect(respGet.attachedFiles[0]).toBeDefined();
    respGet.attachedFiles[0]?.save("./download/");

    respGet = await client.getItem({
      id: respPut.result.object.id,
      transfer_method: TransferMethod.DEST_URL,
    });

    expect(respGet.success).toBeTruthy();
    expect(respGet.attachedFiles.length).toBe(0);
    expect(respGet.result.dest_url).toBeDefined();
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    expect(false).toBeTruthy();
  }
});

it("Put zero bytes file. Multipart transfer_method", async () => {
  try {
    const name = TIME + "_file_zero_bytes_multipart";
    const respPut = await client.put(
      {
        name: name,
        transfer_method: TransferMethod.MULTIPART,
      },
      {
        file: zeroBytesFilePath,
        name: name,
      }
    );
    expect(respPut.success).toBeTruthy();

    let respGet = await client.getItem({
      id: respPut.result.object.id,
      transfer_method: TransferMethod.MULTIPART,
    });

    expect(respGet.success).toBeTruthy();
    expect(respGet.result.dest_url).toBeUndefined();
    expect(respGet.attachedFiles.length).toBe(1);
    expect(respGet.attachedFiles[0]).toBeDefined();
    respGet.attachedFiles[0]?.save("./download/");

    respGet = await client.getItem({
      id: respPut.result.object.id,
      transfer_method: TransferMethod.DEST_URL,
    });

    expect(respGet.success).toBeTruthy();
    expect(respGet.attachedFiles.length).toBe(0);
    expect(respGet.result.dest_url).toBeUndefined();
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    throw e;
  }
});

it("Put file. post-url transfer_method", async () => {
  const name = TIME + "_file_post_url";
  const respPut = await client.put(
    {
      name: name,
      transfer_method: TransferMethod.POST_URL,
    },
    {
      file: testFilePath,
      name: name,
    }
  );
  expect(respPut.success).toBeTruthy();

  let respGet = await client.getItem({
    id: respPut.result.object.id,
    transfer_method: TransferMethod.MULTIPART,
  });

  expect(respGet.success).toBeTruthy();
  expect(respGet.result.dest_url).toBeUndefined();
  expect(respGet.attachedFiles.length).toBe(1);
  expect(respGet.attachedFiles[0]).toBeDefined();
  respGet.attachedFiles[0]?.save("./download/");

  respGet = await client.getItem({
    id: respPut.result.object.id,
    transfer_method: TransferMethod.DEST_URL,
  });

  expect(respGet.success).toBeTruthy();
  expect(respGet.attachedFiles.length).toBe(0);
  expect(respGet.result.dest_url).toBeDefined();
});

it("Put zero bytes file. post-url transfer_method", async () => {
  const name = TIME + "_file_zero_bytes_post_url";
  const respPut = await client.put(
    {
      name: name,
      transfer_method: TransferMethod.POST_URL,
    },
    {
      file: zeroBytesFilePath,
      name: name,
    }
  );
  expect(respPut.success).toBeTruthy();
});

it("get url and put upload", async () => {
  let response;
  const name = TIME + "_file_split_put_url";
  try {
    const request: Share.PutRequest = {
      transfer_method: TransferMethod.PUT_URL,
      name: name,
    };
    response = await client.requestUploadURL(request);
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    throw e;
  }

  const url = response.accepted_result?.put_url || "";

  const uploader = new FileUploader();
  await uploader.uploadFile(
    url,
    {
      file: testFilePath,
      name: name,
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
      const request_id: string = response.request_id || "";
      response = await client.pollResult(request_id);
      expect(response.status).toBe("Success");
      break;
    } catch {
      expect(retry).toBeLessThan(maxRetry - 1);
    }
  }
});

it("get url and post upload", async () => {
  let response;
  const name = TIME + "_file_split_post_url";
  try {
    const params = getFileUploadParams(testFilePath);

    const request: Share.PutRequest = {
      transfer_method: TransferMethod.POST_URL,
      name: name,
      crc32c: params.crc32c,
      sha256: params.sha256,
      size: params.size,
    };

    response = await client.requestUploadURL(request);
  } catch (e) {
    e instanceof PangeaErrors.APIError
      ? console.log(e.toString())
      : console.log(e);
    throw e;
  }

  console.log(response.request_id);
  const url = response.accepted_result?.post_url || "";
  const file_details = response.accepted_result?.post_form_data;

  const uploader = new FileUploader();
  await uploader.uploadFile(
    url,
    {
      file: testFilePath,
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
      const request_id: string = response.request_id || "";
      response = await client.pollResult(request_id);
      expect(response.status).toBe("Success");
      break;
    } catch {
      expect(retry).toBeLessThan(maxRetry - 1);
    }
  }
});

it("Item life cycle", async () => {
  // Create a folder
  const respCreate = await client.folderCreate({ folder: FOLDER_FILES });
  expect(respCreate.success).toBeTruthy();
  const folderID = respCreate.result.object.id;

  // # Upload a file with path as unique param
  const path1 = FOLDER_FILES + "/" + TIME + "_file_multipart_1";
  const respPutPath = await client.put(
    {
      folder: path1,
      transfer_method: TransferMethod.MULTIPART,
    },
    {
      file: testFilePath,
      name: path1,
    }
  );

  expect(respPutPath.success).toBeTruthy();
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
      file: testFilePath,
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
    format: Share.ArchiveFormat.ZIP,
    transfer_method: TransferMethod.MULTIPART,
  });
  expect(respGetArchive1.success).toBeTruthy();
  expect(respGetArchive1.result.dest_url).toBeUndefined();
  expect(respGetArchive1.attachedFiles.length).toBe(1);
  respGetArchive1.attachedFiles.forEach((file) => {
    file.save("./download/");
  });

  const respGetArchive2 = await client.getArchive({
    ids: [folderID],
    format: Share.ArchiveFormat.TAR,
    transfer_method: TransferMethod.DEST_URL,
  });
  expect(respGetArchive2.success).toBeTruthy();
  expect(respGetArchive2.result.dest_url).toBeDefined();
  expect(respGetArchive2.attachedFiles.length).toBe(0);

  // Download file
  const url = respGetArchive2.result.dest_url ?? "";
  let downloadedFile = await client.downloadFile(url);
  downloadedFile.save("./download/");
  expect(downloadedFile.file.byteLength).toBeGreaterThan(0);

  // Create share link
  const authenticators: Share.Authenticator[] = [
    {
      auth_type: Share.AuthenticatorType.PASSWORD,
      auth_context: "somepassword",
    },
  ];
  const linkList: Share.ShareLinkCreateItem[] = [
    {
      targets: [folderID],
      link_type: Share.LinkType.EDITOR,
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
  expect(link?.authenticators[0]?.auth_type).toBe(
    Share.AuthenticatorType.PASSWORD
  );
  expect(link?.link).toBeDefined();
  expect(link?.id).toBeDefined();
  expect(link?.targets.length).toBe(1);

  const linkID = link?.id ?? "";

  // Send share link
  const respSendLink = await client.shareLinkSend({
    links: [
      {
        id: linkID,
        email: "user@email.com",
      },
    ],
    sender_email: "sender@email.com",
    sender_name: "Sender Name",
  });
  expect(respSendLink.result.share_link_objects.length).toBe(1);

  // Get share link
  const respGetLink = await client.shareLinkGet({
    id: linkID,
  });
  expect(respGetLink.success).toBeTruthy();
  expect(respGetLink.result.share_link_object.link).toBe(link?.link);
  expect(respGetLink.result.share_link_object.access_count).toBe(0);
  expect(respGetLink.result.share_link_object.max_access_count).toBe(3);
  expect(respGetLink.result.share_link_object.created_at).toBe(
    link?.created_at
  );
  expect(respGetLink.result.share_link_object.expires_at).toBe(
    link?.expires_at
  );

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
