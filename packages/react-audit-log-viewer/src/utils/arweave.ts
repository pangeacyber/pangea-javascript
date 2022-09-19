// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import axios from "axios";
import { Audit } from "../types";

const ARWEAVE_BASE_URL = "https://arweave.net";

const ARWEAVE_GRAPHQL_URL = `${ARWEAVE_BASE_URL}/graphql`;

const arweaveTransactionUrl = (transactionId: string): string => {
  return `${ARWEAVE_BASE_URL}/${transactionId}/`;
};

export const arweaveViewTransactionUrl = (transactionId: string): string => {
  return `https://viewblock.io/arweave/tx/${transactionId}`;
};

export type PublishedRoots = Record<number, Audit.Root>;

export const getArweavePublishedRoots = async (
  treeName: string,
  treeSizes: number[],
  fetchRoot: (body: Audit.RootRequest) => Promise<Audit.RootResponse>
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

  const response = await axios.post(
    ARWEAVE_GRAPHQL_URL,
    { query },
    {
      responseType: "json",
    }
  );
  if (response.status !== 200) return {};

  const publishedRoots: PublishedRoots = {};

  const edges = response.data?.data?.transactions?.edges ?? [];
  for (let idx = 0; idx < edges.length; idx++) {
    const edge = edges[idx];

    const nodeId = edge?.node?.id;
    const tags = edge?.node?.tags ?? [];

    const treeSizeTags = tags.filter((tag: any) => tag?.name === "tree_size");
    if (!treeSizeTags.length) continue;

    const treeSize = treeSizeTags[0]?.value;

    const transactionUrl = arweaveTransactionUrl(nodeId);
    const response = await axios.get(transactionUrl);
    if (response.status !== 200 || response.statusText === "Pending") {
      continue;
    }

    try {
      const root = {
        ...response.data,
        transactionId: nodeId,
      };

      publishedRoots[treeSize] = root;
    } catch (err) {
      console.error("Failed parsing arweave data.");
    }
  }

  for (let idx = 0; idx < treeSizes.length; idx++) {
    const treeSize = treeSizes[idx];
    if (!(treeSize in publishedRoots)) {
      const body = !!treeSize ? { tree_size: treeSize } : {};
      const root = await fetchRoot(body).catch((err) => {
        // FIXME: Support onError
        console.error(err);
      });

      if (root) {
        let transactionId = "";
        try {
          transactionId = root?.url ? root.url.split("/").slice(-1)[0] : "";
        } catch (err) {
          console.error("Error parsing root url");
        }
        publishedRoots[treeSize] = {
          ...root,
          transactionId,
        };
      }
    }
  }

  return publishedRoots;
};
