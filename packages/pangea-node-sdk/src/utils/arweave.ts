// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { Audit } from "@src/types.js";

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

  const response = await fetch(ARWEAVE_GRAPHQL_URL, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  });
  if (!response.ok) return {};

  const publishedRoots: PublishedRoots = {};
  const body: any = await response.json();
  const edges = body?.data?.transactions?.edges ?? [];

  for (let idx = 0; idx < edges.length; idx++) {
    const edge = edges[idx];

    const nodeId = edge?.node?.id;
    const tags = edge?.node?.tags ?? [];

    const treeSizeTags = tags.filter((tag: any) => tag?.name === "tree_size");

    if (!treeSizeTags.length) continue;

    const treeSize = treeSizeTags[0]?.value;
    const transactionUrl = arweaveTransactionUrl(nodeId);

    const response = await fetch(transactionUrl, { method: "GET" });
    if (!response.ok || response.statusText === "Pending") {
      continue;
    }

    publishedRoots[treeSize] = {
      ...((await response.json()) as object),

      // @ts-expect-error
      transactionId: nodeId,
    };
  }

  for (let idx = 0; idx < treeSizes.length; idx++) {
    const treeSize = treeSizes[idx];

    if (treeSize && !(treeSize in publishedRoots)) {
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
