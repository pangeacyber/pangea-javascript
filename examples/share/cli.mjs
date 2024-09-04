#!/usr/bin/env node

// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { defineCommand, runMain } from "citty";
import { PangeaConfig, Share, ShareService } from "pangea-node-sdk";

const main = defineCommand({
  meta: {
    name: "share",
    version: "0.0.0",
    description:
      "An example command line utility that creates an email+code, SMS+code, " +
      "or password-secured download/upload/editor share-link for a given " +
      "file or for each file in a given directory.",
  },
  args: {
    input: {
      type: "string",
      required: true,
      alias: "i",
      description: "Local path to upload.",
    },
    dest: {
      type: "string",
      default: "/",
      description: "Destination path in Share.",
    },
    email: {
      type: "string",
      description: "Email address to protect the share link with.",
    },
    phone: {
      type: "string",
      description: "Phone number to protect the share link with.",
    },
    password: {
      type: "string",
      description: "Password to protect the share link with.",
    },
    link_type: {
      type: "string",
      default: Share.LinkType.DOWNLOAD,
      description: "Type of link.",
    },
  },
  async run({ args }) {
    if (!args.email && !args.phone && !args.password) {
      throw new Error(
        "At least one of --email, --phone, or --password must be provided."
      );
    }

    /** @type {Set<Share.Authenticator>} */
    const authenticators = new Set();
    if (args.password) {
      authenticators.add({
        auth_type: Share.AuthenticatorType.PASSWORD,
        auth_context: args.password,
      });
    }
    if (args.email) {
      authenticators.add({
        auth_type: Share.AuthenticatorType.EMAIL_OTP,
        auth_context: args.email,
      });
    }
    if (args.phone) {
      authenticators.add({
        auth_type: Share.AuthenticatorType.SMS_OTP,
        auth_context: args.phone,
      });
    }

    const share = new ShareService(
      // @ts-expect-error
      process.env.PANGEA_SHARE_TOKEN,
      new PangeaConfig({ domain: process.env.PANGEA_DOMAIN })
    );

    // Upload files.
    const files = (await fs.lstat(args.input)).isDirectory()
      ? (await fs.readdir(args.input)).map((x) => path.resolve(args.input, x))
      : [args.input];
    const objectIds = new Set();
    for (const file of files) {
      const uploadResponse = await share.put(
        {
          path: `${args.dest}/${path.basename(file)}`,
        },
        { file, name: "file" }
      );
      objectIds.add(uploadResponse.result.object.id);
    }

    // Create share link.
    const linkResponse = await share.shareLinkCreate({
      links: [
        {
          targets: Array.from(objectIds),
          // @ts-expect-error
          link_type: args.link_type,
          authenticators: Array.from(authenticators),
        },
      ],
    });
    console.log(linkResponse.result.share_link_objects[0].link);
  },
});

runMain(main);
