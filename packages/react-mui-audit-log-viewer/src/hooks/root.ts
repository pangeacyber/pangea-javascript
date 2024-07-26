import { useEffect, useState } from "react";
import { Audit } from "../types";

import { PublishedRoots, getArweavePublishedRoots } from "../utils/arweave";

export const usePublishedRoots = ({
  isVerificationCheckEnabled = true,
  root,
  logs,
  onFetchRoot,
}: {
  isVerificationCheckEnabled?: boolean;
  root?: Audit.Root;
  logs: Audit.FlattenedAuditRecord[];
  onFetchRoot?: (body: Audit.RootRequest) => Promise<Audit.RootResponse>;
}): PublishedRoots | undefined => {
  const [publishedRoots, setPublishedRoots] = useState<
    PublishedRoots | undefined
  >();

  useEffect(() => {
    if (!root?.tree_name || !isVerificationCheckEnabled || !onFetchRoot) return;
    const treeName = root?.tree_name;
    const treeSizes = new Set<number>();
    treeSizes.add(root?.size ?? 0);
    logs
      .filter((log) => log.leaf_index !== undefined)
      .forEach((log) => {
        const idx = Number(log.leaf_index);

        treeSizes.add(idx + 1);
        if (idx > 0) {
          treeSizes.add(idx);
        }
      });

    getArweavePublishedRoots(treeName, Array.from(treeSizes), onFetchRoot).then(
      (publishedRoots) => {
        setPublishedRoots(publishedRoots);
      }
    );
  }, [root?.tree_name, logs, isVerificationCheckEnabled]);

  return publishedRoots;
};
