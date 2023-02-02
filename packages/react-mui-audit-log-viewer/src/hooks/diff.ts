// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { useMemo } from "react";

// FIXME: Is this going to work
import { diffWords } from "diff";

export interface Change {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export const useDiffWords = (
  oldValue: string | undefined,
  newValue: string | undefined
): Change[] => {
  const changes = useMemo(() => {
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

  return changes;
};
