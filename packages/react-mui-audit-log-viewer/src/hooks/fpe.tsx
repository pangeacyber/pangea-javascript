import { useMemo } from "react";
import { Audit } from "../types";
import { Change } from "./diff";
import { mkMK } from "@mui/material/locale";

export interface FPEMatch {
  a: string; // fpe_alphabet
  s: number; // starting character
  e: number; // ending character
  k: string; // the key
  p?: number; // number of padded characters
}

export interface FPEContext {
  a: string; // The algorithm used
  t: string; // Tweak used to salt encrypted values
  m: FPEMatch[]; // matches
  k?: string; // vault secret key id
  v?: number; // vault secret key version
  c?: string; // vault config id
  j?: string | string[]; // fields that are json encoded
}

export const getRecordFpeContext = (
  context: string | undefined
): FPEContext | undefined => {
  try {
    const fpe: FPEContext = JSON.parse(atob(context ?? ""));
    return fpe;
  } catch {
    return undefined;
  }
};

export const getFieldMatches = (
  fieldKey: string,
  context: FPEContext | undefined
): FPEMatch[] => {
  if (!context) return [];

  const pathKey = `envelope.event.${fieldKey}`;
  const isJson = (context?.j ?? []).includes(pathKey);

  return (context?.m ?? [])
    .filter((m) => (isJson ? m.k.startsWith(`${pathKey}.`) : m.k === pathKey))
    .map((m) => {
      return {
        ...m,
        k: isJson ? m.k.substring(`${pathKey}.`.length) : m.k,
      };
    });
};

export const useFpeContext = (
  record: Audit.FlattenedAuditRecord
): FPEContext | undefined => {
  const context = useMemo(() => {
    return getRecordFpeContext(record?.fpe_context);
  }, [record.fpe_context]);

  return context;
};

const getObjectKeyFromPath = (key: string): string => {
  return key.replace(/~0/g, ".").replace(/~1/g, "~");
};

export function updateMatches(
  jsonString: string,
  matches: FPEMatch[]
): FPEMatch[] {
  const parsedObject = JSON.parse(jsonString);
  const stringifiedObject = JSON.stringify(parsedObject);

  function findValuePath(obj: any, path: string[]): any {
    return path.reduce(
      (acc, key) => acc && acc[getObjectKeyFromPath(key)],
      obj
    );
  }

  function getStringifiedPosition(
    jsonString: string,
    jsonObject: any,
    path: string[],
    match: FPEMatch
  ): FPEMatch {
    let currentIndex = 1;

    const valueLastElement = getObjectKeyFromPath(path[path.length - 1]);
    const value = findValuePath(jsonObject, path);

    const valueKeyPrefix = `"${valueLastElement}":`;
    const valueString = `${valueKeyPrefix}${JSON.stringify(value)}`;

    let pathForIndex = path.slice(0, currentIndex);
    let lastElement = getObjectKeyFromPath(
      pathForIndex[pathForIndex.length - 1]
    );

    let valueForIndex = findValuePath(jsonObject, pathForIndex);
    let valueForIndexString = `"${lastElement}":${JSON.stringify(valueForIndex)}`;

    for (let i = 0; i < jsonString.length; i++) {
      if (jsonString.substring(i, i + valueString.length) === valueString) {
        if (currentIndex === path.length) {
          const valueStartIndex = i + valueKeyPrefix.length + 1;
          return {
            ...match,
            s: valueStartIndex + match.s,
            e: valueStartIndex + match.e,
          };
        }
      }

      if (
        jsonString.substring(i, i + valueForIndexString.length) ===
        valueForIndexString
      ) {
        currentIndex++;

        pathForIndex = path.slice(0, currentIndex);
        lastElement = getObjectKeyFromPath(
          pathForIndex[pathForIndex.length - 1]
        );

        valueForIndex = findValuePath(jsonObject, pathForIndex);
        valueForIndexString = `"${lastElement}":${JSON.stringify(valueForIndex)}`;
      }
    }

    throw new Error(
      `Value for JSON path "${path.join(".")}" not found in the JSON string.`
    );
  }

  return matches.map((match) => {
    const path = match.k.split(".");
    return getStringifiedPosition(stringifiedObject, parsedObject, path, match);
  });
}

export const FPE_REDACTION_INFO =
  "Value has been redacted with format preserving encryption";
export const injectFPEMatchesIntoChanges = (
  matches: FPEMatch[],
  changes: Change[]
): Change[] => {
  let result: Change[] = [];

  let changesCurrentIndex = 0;
  let currentIndex = 0;

  // Flatten the changes into a single string to work with indices
  const fullString = changes.map((change) => change.value).join("");

  const currentChanges = [...changes];

  matches.forEach((match) => {
    const { s, e } = match;

    // Process changes up to the start of the match
    while (currentIndex < s) {
      const change = currentChanges.shift();
      if (!change) break;

      const remainingLength = s - currentIndex;

      if (change.value.length <= remainingLength) {
        result.push(change);
        currentIndex += change.value.length;
        changesCurrentIndex += change.value.length;
      } else {
        // Split the change at the match start
        const splitChange: Change = {
          ...change,
          value: change.value.slice(0, remainingLength),
        };
        const remainingChange: Change = {
          ...change,
          value: change.value.slice(remainingLength),
        };

        result.push(splitChange);
        currentChanges.unshift(remainingChange); // put the remaining part back to be processed later
        currentIndex += splitChange.value.length;
        changesCurrentIndex += splitChange.value.length;
      }
    }

    // Inject the redacted change
    const redactedChange: Change = {
      prefix: fullString.slice(s - 1, s),
      suffix: fullString.slice(e, e + 1),
      value: fullString.slice(s, e),
      redacted: true,
      info: FPE_REDACTION_INFO,
    };
    result.push(redactedChange);
    currentIndex = e;

    while (changesCurrentIndex < currentIndex) {
      const change = currentChanges.shift();
      if (!change) break;

      const remainingLength = currentIndex - changesCurrentIndex;

      if (change.value.length <= remainingLength) {
        changesCurrentIndex += change.value.length;
      } else {
        // Split the change at the match start
        const splitChange: Change = {
          ...change,
          value: change.value.slice(0, remainingLength),
        };
        const remainingChange: Change = {
          ...change,
          value: change.value.slice(remainingLength),
        };

        currentChanges.unshift(remainingChange); // put the remaining part back to be processed later
        changesCurrentIndex += splitChange.value.length;
      }
    }
  });

  // Append any remaining changes
  result = result.concat(currentChanges);

  return result;
};
