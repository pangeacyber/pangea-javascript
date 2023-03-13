import { PDG, FilterOptions } from "@pangeacyber/react-mui-shared";
import { Audit } from "../types";

// FIXME: Determine how we should expose types here?
export const AuditRecordFields: PDG.GridSchemaFields = {
  received_at: {
    label: "Time",
    cellClassName: "columnPrimary",
    type: "dateTime",
  },
  actor: {
    label: "Actor",
    sortable: false,
  },
  action: {
    label: "Action",
    sortable: false,
  },
  target: {
    label: "Target",
    sortable: false,
  },
  message: {
    label: "Message",
    flex: 10,
    minWidth: 200,
    sortable: false,
  },
  status: {
    label: "Status",
    sortable: false,
  },
  new: {
    label: "New",
    sortable: false,
  },
  old: {
    label: "Old",
    sortable: false,
  },
  source: {
    label: "Source",
    sortable: false,
  },
  timestamp: {
    label: "Timestamp",
    sortable: false,
    type: "dateTime",
  },
  tenant_id: {
    label: "Tenant ID",
    sortable: false,
  },
};

export const AuditFilterFields: FilterOptions<Audit.AuditRecord> = {
  actor: {
    label: "Actor",
  },
  action: {
    label: "Action",
  },
  target: {
    label: "Target",
  },
  message: {
    label: "Message",
  },
  status: {
    label: "Status",
  },
  new: {
    label: "New",
  },
  old: {
    label: "Old",
  },
  source: {
    label: "Source",
  },
  tenant_id: {
    label: "Tenant ID",
  },
};
