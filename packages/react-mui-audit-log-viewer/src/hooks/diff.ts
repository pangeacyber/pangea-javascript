// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { useMemo } from "react";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";

// FIXME: Is this going to work
import { diffWords } from "diff";

export interface Change {
  value: string;
  added?: boolean;
  removed?: boolean;
  prefix?: string;
  suffix?: string;
}

export const useDiffWords = (
  oldValue: string | undefined,
  newValue: string | undefined
): Change[] => {
  const diff = useMemo(() => {
    if (!oldValue || !newValue) return [];
    try {
      const oldJson = JSON.parse(oldValue);
      const newJson = JSON.parse(newValue);
      return diffWords(oldValue, newValue);
    } catch {
      try {
        return diffWords(oldValue, newValue);
      } catch {
        return [];
      }
    }
  }, [oldValue, newValue]);

  const changes = useMemo(() => {
    const changes: Change[] = cloneDeep(diff);
    changes.forEach((change, idx) => {
      let prefix = "";
      let suffix = "";

      if (!change.added && !change.removed) return;

      const prefixChange = find(
        diff.slice(0, idx).reverse(),
        (c) => !c.added && !c.removed
      );
      if (prefixChange?.value) {
        prefix = prefixChange.value;
      }

      const suffixChange = find(diff.slice(idx), (c) => !c.added && !c.removed);
      if (suffixChange?.value) {
        suffix = suffixChange.value;
      }

      change.prefix = prefix;
      change.suffix = suffix;
    });
    return changes;
  }, [diff]);

  return changes;
};
