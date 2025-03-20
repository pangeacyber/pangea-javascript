/* eslint-disable no-console */

import {
  PangeaConfig,
  ShareService,
  TransferMethod,
  Share,
} from "pangea-node-sdk";
import * as fs from "fs";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SHARE_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});

// Create Share client
const client = new ShareService(token, config);

// Create unique folder path
const time = Math.round(Date.now() / 1000);
const folderPath = "/sdk_examples/node/delete/" + time;
const filepath = "./testfile.pdf";

(async () => {
  try {
    console.log("Creating folder...");
    // Create a folder
    const respCreate = await client.folderCreate({
      path: folderPath,
    });
    const folderID = respCreate.result.object.id;
    console.log(`Create folder success. Folder ID: ${folderID}`);

    // # Upload a file with path as unique param
    // Read file content as buffer
    const data = fs.readFileSync(filepath);

    console.log("\nUploading file with path as unique field...");
    const path1 = folderPath + "/" + time + "_file_multipart_1";
    const respPutPath = await client.put(
      {
        path: path1,
        transfer_method: TransferMethod.MULTIPART,
      },
      {
        file: data,
        name: path1,
      }
    );

    console.log(`Upload success. Item ID: ${respPutPath.result.object.id}`);
    console.log(`\tParent ID: ${respPutPath.result.object.parent_id}`);
    console.log(`\tMetadata: ${respPutPath.result.object.metadata}`);
    console.log(`\tTags: ${respPutPath.result.object.tags}`);

    console.log("\nUploading file with parent_id and name...");
    // Upload a file with parent id and name
    const name2 = time + "_file_multipart_2";
    const metadata = { field1: "value1", field2: "value2" };
    const tags = ["tag1", "tag2"];
    const respPutId = await client.put(
      {
        parent_id: folderID,
        name: name2,
        transfer_method: TransferMethod.MULTIPART,
        metadata: metadata,
        tags: tags,
      },
      {
        file: data,
        name: path1,
      }
    );

    console.log(`Upload success. Item ID: ${respPutId.result.object.id}`);
    console.log(`\tParent ID: ${respPutId.result.object.parent_id}`);
    console.log(`\tMetadata: ${respPutId.result.object.metadata}`);
    console.log(`\tTags: ${respPutId.result.object.tags}`);

    console.log("\nUpdating file with full metadata and tags...");
    // Update file with full metadata and tags
    const respUpdate = await client.update({
      id: respPutPath.result.object.id,
      metadata: metadata,
      tags: tags,
    });

    console.log(`Upload success. Item ID: ${respUpdate.result.object.id}`);
    console.log(`\tParent ID: ${respUpdate.result.object.parent_id}`);
    console.log(`\tMetadata: ${respUpdate.result.object.metadata}`);
    console.log(`\tTags: ${respUpdate.result.object.tags}`);

    console.log("\nUpdating file with additional metadata and tags...");
    // Update file with added metadata and tags
    const addMetadata = { field3: "value3" };
    const addTags = ["tag3"];

    const respUpdateAdd = await client.update({
      id: respPutPath.result.object.id,
      add_metadata: addMetadata,
      add_tags: addTags,
    });

    console.log(`Upload success. Item ID: ${respUpdateAdd.result.object.id}`);
    console.log(`\tParent ID: ${respUpdateAdd.result.object.parent_id}`);
    console.log(`\tMetadata: ${respUpdateAdd.result.object.metadata}`);
    console.log(`\tTags: ${respUpdateAdd.result.object.tags}`);

    console.log("\nGetting archive with multipart transfer method...");
    // Get archive
    const respGetArchive1 = await client.getArchive({
      ids: [folderID],
      format: Share.ArchiveFormat.ZIP,
      transfer_method: TransferMethod.MULTIPART,
    });

    // Using multipart as transfer method it should return just 1 file and no dest url
    console.log(
      `Got ${respGetArchive1.attachedFiles.length} attached file(s).`
    );
    console.log(`Got URL: ${respGetArchive1.result.dest_url}`);

    // Saving attached files
    respGetArchive1.attachedFiles.forEach((file) => {
      file.save("./");
    });

    console.log("\nGetting archive with dest-url transfer method...");
    const respGetArchive2 = await client.getArchive({
      ids: [folderID],
      format: Share.ArchiveFormat.TAR,
      transfer_method: TransferMethod.DEST_URL,
    });

    // Using dest-url as transfer method it should return no attahched files but dest url
    console.log(
      `Got ${respGetArchive2.attachedFiles.length} attached file(s).`
    );
    console.log(`Got URL: ${respGetArchive2.result.dest_url}`);

    console.log("\nDownloading file...");
    // Download file
    const url = respGetArchive2.result.dest_url ?? "";
    let downloadedFile = await client.downloadFile(url);

    console.log("\nCreating share link...");
    // Create share link
    // Create authenticators list to access share link
    const authenticators = [
      {
        auth_type: Share.AuthenticatorType.PASSWORD,
        auth_context: "somepassword",
      },
    ];

    // Create a link's list, each link should have targets (folder or objects), link_type, etc.
    const linkList = [
      {
        targets: [folderID],
        link_type: Share.LinkType.EDITOR,
        max_access_count: 3,
        authenticators: authenticators,
      },
    ];

    // Send share link create request
    const respCreateLink = await client.shareLinkCreate({
      links: linkList,
    });

    const links = respCreateLink.result.share_link_objects;
    console.log(`Created ${links.length} share links`);

    const link = links[0];
    console.log(`Link ID: ${link.id}. Link: ${link.link}`);

    console.log("\nGetting already created link...");
    // Get share link
    const linkID = link?.id ?? "";
    const respGetLink = await client.shareLinkGet({
      id: linkID,
    });
    console.log(
      `Got link ID: ${respGetLink.result.share_link_object.id}. Link: ${respGetLink.result.share_link_object.link}`
    );

    console.log("\nListing share links...");
    // List share link
    const respListLink = await client.shareLinkList();
    console.log(`Got ${respListLink.result.count} link(s)`);

    console.log("\nDeleting link...");
    // Delete share link
    const respDeleteLink = await client.shareLinkDelete({
      ids: [linkID],
    });
    console.log(
      `Deleted ${respDeleteLink.result.share_link_objects.length} link(s)`
    );

    console.log("\nListing files...");
    // List files in folder
    // Create a ListFilter and set its possible values
    const listFilter = {
      folder: folderPath,
    };

    const respList = await client.list({
      filter: listFilter,
    });

    console.log(`Got ${respList.result.count} item(s)`);
  } catch (e) {
    console.log(e.toString());
  }
})();
