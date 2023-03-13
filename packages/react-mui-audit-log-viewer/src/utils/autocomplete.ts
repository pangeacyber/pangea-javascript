import startCase from "lodash/startCase";

const operators = new Set(["AND", "OR"]);
const auditFields = [
  "actor",
  "action",
  "message",
  "new",
  "old",
  "status",
  "target",
];

export const CONDITIONAL_AUDIT_OPTIONS = [
  {
    match: (current: string, previous: string) =>
      (!previous || operators.has(previous)) && !current.includes(":"),
    options: auditFields.map((fieldName) => ({
      value: `${fieldName}:`,
      label: startCase(fieldName),
    })),
  },
  {
    match: (current: string, previous: string) =>
      !operators.has(previous) && !current.includes(":"),
    options: [
      { value: "AND", label: "And" },
      { value: "OR", label: "Or" },
    ],
  },
];
