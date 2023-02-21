// FIXME: Determine how we should expose types here?
export const AuditRecordFields: any = {
  received_at: {
    label: "Time",
    readonly: true,
    cellClassName: "columnPrimary",
    type: "dateTime",
  },
  actor: {
    label: "Actor",
    required: true,
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
    required: true,
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
    readonly: true,
    sortable: false,
    type: "dateTime",
  },
};
