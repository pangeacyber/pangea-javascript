export const schema = {
  string: (s: string): boolean => {
    if (typeof s === "string" && s.trim() !== "") {
      return true;
    }

    return false;
  },
  boolean: (b: boolean): boolean => {
    if (typeof b === "boolean") {
      return true;
    }

    return false;
  },
  number: (n: number): boolean => {
    if (typeof n === "number" && !Number.isNaN(n)) {
      return true;
    }

    return false;
  },
  null: (n: null): boolean => {
    if (n === null) {
      return true;
    }

    return false;
  },
  nan: (n: number): boolean => {
    if (typeof n === "number" && Number.isNaN(n)) {
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
    string: (s?: any): boolean => {
      if (s === undefined) {
        return true;
      }

      return schema.string(s);
    },
    boolean: (b?: any): boolean => {
      if (b === undefined) {
        return true;
      }

      return schema.boolean(b);
    },
    number: (n?: any): boolean => {
      if (n === undefined) {
        return true;
      }

      return schema.number(n);
    },
    null: (n?: any): boolean => {
      if (n === undefined) {
        return true;
      }

      return schema.null(n);
    },
    nan: (n?: any): boolean => {
      if (n === undefined) {
        return true;
      }

      return schema.nan(n);
    },
    array: () => ({
      string: (a?: any[]): boolean => {
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
