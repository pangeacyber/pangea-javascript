import { Audit } from "../../types";

export const EXAMPLE_AUDIT_SCHEMA: Audit.Schema = {
  client_signable: true,
  tamper_proofing: true,
  fields: [
    {
      id: "received_at",
      name: "Time",
      type: "datetime",
      ui_default_visible: true,
    },
    {
      id: "actor",
      name: "Actor",
      type: "string",
      size: 32766,
      ui_default_visible: true,
    },
    {
      id: "source",
      name: "Source",
      type: "string",
      size: 128,
      ui_default_visible: true,
    },
    {
      id: "target",
      name: "Target",
      type: "string",
      size: 128,
      ui_default_visible: true,
    },
    {
      id: "action",
      name: "Action",
      type: "string",
      size: 128,
      ui_default_visible: true,
    },
    {
      id: "status",
      name: "Status",
      type: "string",
      size: 32766,
    },
    {
      id: "message",
      name: "Message",
      type: "string",
      size: 32766,
      ui_default_visible: true,
    },
    {
      id: "amount",
      name: "Amount",
      type: "integer",
    },
    {
      id: "allowed",
      name: "Allowed",
      type: "boolean",
    },
  ],
};

export const EXAMPLE_AUDIT_LOGS: Audit.AuditRecord[] = [
  {
    envelope: {
      received_at: "2025-01-16T01:44:34.712075Z",
      event: {
        source: "FrontDesk_001",
        target: "SignInSheet_001",
        action: "signed in",
        actor: "Dwight Schrute",
        message: "Dwight Schrute signed in at the front desk.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-15T17:19:50.506772Z",
              "Login-From": "192.168.0.1",
              "Login-Time": "2025-01-16T01:44:33.591025Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) Chrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:44:33.597667Z",
            expires_at: "2025-01-18T01:44:33.591031Z",
            id: "dfn_frontdesk_001",
            user_id: "emp_dwight",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:44:28.876160Z",
      event: {
        source: "FrontDesk_001",
        target: "SignInSheet_001",
        action: "signed in",
        actor: "Jim Halpert",
        message: "Jim Halpert signed in at the front desk.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-15T17:19:50.506772Z",
              "Login-From": "192.168.0.2",
              "Login-Time": "2025-01-16T01:44:27.591025Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) Chrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:44:27.597667Z",
            expires_at: "2025-01-18T01:44:27.591031Z",
            id: "dfn_frontdesk_002",
            user_id: "emp_jim",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:44:28.480907Z",
      event: {
        source: "FrontDesk_002",
        target: "SignInSheet_001",
        action: "signed in",
        actor: "Pam Beesly",
        message: "Pam Beesly signed in at the front desk.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-15T17:19:50.506772Z",
              "Login-From": "192.168.0.3",
              "Login-Time": "2025-01-16T01:44:26.591025Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) Chrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:44:26.597667Z",
            expires_at: "2025-01-18T01:44:26.591031Z",
            id: "dfn_frontdesk_003",
            user_id: "emp_pam",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:37:14.223507Z",
      event: {
        source: "FrontDesk_003",
        target: "SignInSheet_002",
        action: "signed in",
        actor: "Michael Scott",
        message: "Michael Scott signed in at the front desk.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-16T01:37:08.372838Z",
              "Login-From": "192.168.0.4",
              "Login-Time": "2025-01-16T01:37:12.507000Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) HeadlessChrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:37:12.804774Z",
            expires_at: "2025-01-18T01:37:12.507008Z",
            id: "dfn_frontdesk_004",
            user_id: "emp_michael",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:37:14.116099Z",
      event: {
        source: "FrontDesk_004",
        target: "SignInSheet_002",
        action: "signed in",
        actor: "Michael Scott",
        message: "Michael Scott grabbed a coffee and signed in again.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-16T01:37:08.372838Z",
              "Login-From": "192.168.0.4",
              "Login-Time": "2025-01-16T01:37:12.507000Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) HeadlessChrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:37:12.804774Z",
            expires_at: "2025-01-18T01:37:12.507008Z",
            id: "dfn_frontdesk_005",
            user_id: "emp_michael",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:37:13.254577Z",
      event: {
        source: "FrontDesk_004",
        target: "SignInSheet_003",
        action: "signed out",
        actor: "Pam Beesly",
        message: "Pam Beesly signed out at the front desk.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-16T01:37:05.203486Z",
              "Login-From": "192.168.0.3",
              "Login-Time": "2025-01-16T01:37:08.372832Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) HeadlessChrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:37:08.376148Z",
            expires_at: "2025-01-18T01:37:08.372838Z",
            id: "dfn_frontdesk_006",
            user_id: "emp_pam",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:37:09.566973Z",
      event: {
        source: "FrontDesk_003",
        target: "SignInSheet_003",
        action: "signed in",
        actor: "Dwight Schrute",
        message:
          "Dwight Schrute signed in again to make sure he's top salesman.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-16T01:37:05.203486Z",
              "Login-From": "192.168.0.1",
              "Login-Time": "2025-01-16T01:37:08.372832Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) HeadlessChrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:37:08.376148Z",
            expires_at: "2025-01-18T01:37:08.372838Z",
            id: "dfn_frontdesk_007",
            user_id: "emp_dwight",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:37:09.496212Z",
      event: {
        source: "FrontDesk_004",
        target: "SignInSheet_003",
        action: "signed in",
        actor: "Jim Halpert",
        message: "Jim Halpert signed in again, possibly to prank Dwight.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-16T01:37:05.203486Z",
              "Login-From": "192.168.0.2",
              "Login-Time": "2025-01-16T01:37:08.372832Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) HeadlessChrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:37:08.376148Z",
            expires_at: "2025-01-18T01:37:08.372838Z",
            id: "dfn_frontdesk_008",
            user_id: "emp_jim",
          },
        }),
      },
    },
    published: false,
  },
  {
    envelope: {
      received_at: "2025-01-16T01:38:09.496212Z",
      event: {
        source: "FrontDesk_001",
        target: "Accounting_001",
        action: "filled expense",
        // @ts-ignore
        allowed: false,
        amount: 100,
        actor: "Dwight Schrute",
        message:
          "Dwight Schrute filled expense for a new stapler, says it is Jim's fault.",
        new: JSON.stringify({
          session: {
            context: {
              "Last-Login-City": "Scranton",
              "Last-Login-Country": "United States",
              "Last-Login-Time": "2025-01-16T01:37:05.203486Z",
              "Login-From": "192.168.0.2",
              "Login-Time": "2025-01-16T01:37:08.372832Z",
              "User-Agent":
                "Paper-OS/1.0 (Dunder; Mifflin) HeadlessChrome/131.0.0.0 Safari/537.36",
            },
            created_at: "2025-01-16T01:37:08.376148Z",
            expires_at: "2025-01-18T01:37:08.372838Z",
            id: "dfn_frontdesk_008",
            user_id: "emp_jim",
          },
        }),
      },
    },
    published: false,
  },
];

export const getMockAuditRecords = () => EXAMPLE_AUDIT_LOGS;
