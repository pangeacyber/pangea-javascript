// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import got, { Options } from "got";
import type { Response } from "got";

import { Audit } from "../types.js";

const ARWEAVE_BASE_URL = "https://arweave.net";
const ARWEAVE_GRAPHQL_URL = `${ARWEAVE_BASE_URL}/graphql`;

const arweaveTransactionUrl = (transactionId: string): string => {
  return `${ARWEAVE_BASE_URL}/${transactionId}/`;
};

export type PublishedRoots = Record<number, Audit.Root>;

export const getArweavePublishedRoots = async (
  treeName: string,
  treeSizes: number[],
  fetchRoot: (treeSize: number) => Promise<Audit.Root>
): Promise<PublishedRoots> => {
  if (!treeSizes.length) return {};
  const query = `
{
    transactions(
        tags: [
            {
                name: "tree_size"
                values: [${treeSizes.map((size) => `"${size}"`).join(", ")}]
            },
            {
                name: "tree_name"
                values: ["${treeName}"]
            }
        ]
    ) {
        edges {
            node {
                id
                tags {
                    name
                    value
                }
            }
        }
    }
}
    `;

  const options: Options = {
    json: { query },
    responseType: "json",
  };
  const response = (await got.post(ARWEAVE_GRAPHQL_URL, options)) as Response;
  if (response.statusCode !== 200) return {};

  const publishedRoots: PublishedRoots = {};
  const body: any = response.body as JSON;
  const edges = body?.data?.transactions?.edges ?? [];

  for (let idx = 0; idx < edges.length; idx++) {
    const edge = edges[idx];

    const nodeId = edge?.node?.id;
    const tags = edge?.node?.tags ?? [];

    const treeSizeTags = tags.filter((tag: any) => tag?.name === "tree_size");

    if (!treeSizeTags.length) continue;

    const treeSize = treeSizeTags[0]?.value;
    const transactionUrl = arweaveTransactionUrl(nodeId);

    const response = await got.get({ url: transactionUrl });
    if (response.statusCode !== 200 || response.statusMessage === "Pending") {
      continue;
    }

    // @ts-ignore
    publishedRoots[treeSize] = {
      ...JSON.parse(response.body),
      transactionId: nodeId,
    };
  }

  for (let idx = 0; idx < treeSizes.length; idx++) {
    const treeSize = treeSizes[idx];

    if (!(treeSize in publishedRoots)) {
      const root = await fetchRoot(treeSize).catch((err) => {
        console.log("Failed to fetch server roots", err);
      });

      if (root) {
        publishedRoots[treeSize] = {
          ...root,
        };
      }
    }
  }

  return publishedRoots;
};
