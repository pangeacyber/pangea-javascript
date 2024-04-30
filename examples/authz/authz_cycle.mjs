/* eslint-disable no-console */

import { PangeaConfig, AuthZService } from "pangea-node-sdk";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_AUTHZ_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create AuthZ client
const authz = new AuthZService(token, config);

// Create unique folder path
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

(async () => {
  try {
    // Create tuples
    console.log("Creating tuples...");
    await authz.tupleCreate({
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
    console.log("Create success.");

    // Tuple list with resource
    console.log("Listing tuples with resource...");
    const rListWithResource = await authz.tupleList({
      filter: {
        resource_type: TYPE_FOLDER,
        resource_id: FOLDER_1,
      },
    });

    console.log(`Total tuples listed: ${rListWithResource.result.count}`);
    rListWithResource.result.tuples.forEach((tuple, i) => {
      console.log(`Tuple #${i}`);
      console.log(`\tType: ${tuple.subject.type}`);
      console.log(`\tSubject ID: ${tuple.subject.id}`);
    });

    // Tuple list with subject
    console.log("Listing tuples with subject...");
    const tListWithSubject = await authz.tupleList({
      filter: {
        subject_type: TYPE_USER,
        subject_id: USER_1,
      },
    });

    console.log(`Total tuples listed: ${tListWithSubject.result.count}`);
    tListWithSubject.result.tuples.forEach((tuple, i) => {
      console.log(`Tuple #${i}`);
      console.log(`\tType: ${tuple.resource.type}`);
      console.log(`\tResource ID: ${tuple.resource.id}`);
    });

    // Tuple delete
    console.log("Deleting tuple...");
    await authz.tupleDelete({
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
    console.log("Delete success");

    // Check no debug
    console.log("Checking tuple...");
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

    if (rCheck.result.allowed) {
      console.log("Subject IS allowed");
    } else {
      console.log("Subject is NOT allowed");
    }

    // Check debug
    console.log("Checking tuple with debug enabled...");
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

    if (rCheck.result.allowed) {
      console.log("Subject IS allowed");
    } else {
      console.log("Subject is NOT allowed");
    }
    console.log(`Debug data: ${rCheck.result.debug}`);

    // List resources
    console.log("Listing resources...");
    const rListResources = await authz.listResources({
      type: TYPE_FOLDER,
      action: RELATION_EDITOR,
      subject: {
        type: TYPE_USER,
        id: USER_2,
      },
    });

    console.log(`Total resources listed: ${rListResources.result.ids.length}`);
    rListResources.result.ids.forEach((id, i) => {
      console.log(`Resource #${i}. ID: ${id}`);
    });

    // List subjects
    console.log("Listing subjects...");
    const rListSubjects = await authz.listSubjects({
      resource: {
        type: TYPE_FOLDER,
        id: FOLDER_2,
      },
      action: RELATION_EDITOR,
    });

    console.log(
      `Total subjects listed: ${rListSubjects.result.subjects.length}`
    );
    rListSubjects.result.subjects.forEach((subject, i) => {
      console.log(`Subject #${i}. Type: ${subject.type}. ID: ${subject.id}`);
    });
  } catch (e) {
    console.log(e.toString());
  }
})();
