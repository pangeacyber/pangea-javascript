export const schema = {
  string: (s: string): boolean => {
    if (typeof s === "string" && s.trim() !== "") {
      return true;
    }

    return false;
  },
  object: () => ({
    shape: (o: { [key: string]: boolean }) => {
      return o;
    },
  }),
  optional: () => ({
    string: (s?: string) => {
      if (s === undefined) {
        return true;
      }

      return schema.string(s);
    },
    array: () => ({
      string: (a?: string[]): boolean => {
        if (a === undefined) {
          return true;
        }

        if (Array.isArray(a)) {
          return a.every(schema.string);
        }

        return false;
      },
    }),
  }),
};
