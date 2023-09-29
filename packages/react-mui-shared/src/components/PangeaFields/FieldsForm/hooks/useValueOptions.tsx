import { useEffect, useMemo, useState } from "react";
import pickBy from "lodash/pickBy";
import { ValueOptions, ValueOptionsSchemaProps } from "../types";

const defaultFieldOptions = (
  options: ValueOptionsSchemaProps | undefined
): ValueOptions[] => {
  return options?.valueOptions ?? [];
};

export const useValueOptions = ({
  values,
  options,
}: {
  values: any;
  options: ValueOptionsSchemaProps | undefined;
}): ValueOptions[] => {
  const [fetchedOptions, setFetchedOptions] = useState<ValueOptions[]>(
    defaultFieldOptions(options)
  );

  const fetchDepValues = useMemo(() => {
    const deps = new Set(options?.fetchedDependantFields ?? []);

    return pickBy(values ?? {}, (v, k) => deps.has(k));
  }, [options?.fetchedDependantFields, values]);

  useEffect(() => {
    if (options?.fetchedValueOptions !== undefined) {
      options
        ?.fetchedValueOptions(fetchDepValues)
        .then((options_) => setFetchedOptions(options_));
    }

    // Note: We want to only support this on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDepValues]);

  useEffect(() => {
    if (typeof options?.valueOptions === "object") {
      setFetchedOptions(options?.valueOptions ?? []);
    }
  }, [JSON.stringify(options?.valueOptions)]);

  return fetchedOptions;
};
