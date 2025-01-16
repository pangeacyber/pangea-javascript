/**
 * This utility file simulates (or proxies to) an API server for use by the AuditLogViewer
 * component within the Storybook examples.
 *
 * **Primary Purpose**: Provide the required callback functions—`onSearch`, `onPageChange`,
 * `onDownload`, and `onFetchRoot`—which the `AuditLogViewer` component relies on to fetch
 * logs, pagination data, download links, and root data for verification.
 *
 * **Two Modes**:
 * 1. **Mock Mode**: If the necessary environment variables (`STORYBOOK_SERVICE_DOMAIN`,
 *    `STORYBOOK_PANGEA_TOKEN`, `STORYBOOK_CONFIG_ID`) are _not_ provided, the callbacks
 *    return mock data from `getMockAuditRecords()`.
 * 2. **Pangea-Connected Mode**: If environment variables _are_ provided, this file proxies
 *    requests to the real Pangea Audit Log service (`/search`, `/results`, `/download_results`,
 *    `/root`) through your application server.
 *
 * **Recommended Production Pattern**:
 * - In a real production scenario, your front-end should _not_ pass Pangea service tokens
 *   directly. Instead, set up server-side endpoints that handle authentication and call
 *   the Pangea service, returning data to your client.
 *
 * **Callback Definitions**:
 * - `onSearch(body: Audit.SearchRequest)`:
 *    Called when the user performs a search. Should return a Promise resolving to `Audit.SearchResponse`.
 * - `onPageChange(body: Audit.ResultRequest)`:
 *    Invoked when the user navigates to a different page of results. Should return `Audit.ResultResponse`.
 * - `onDownload(body: Audit.DownloadResultRequest)`:
 *    Generates a pre-signed URL (or similar) for downloading the requested logs.
 * - `onFetchRoot(body: Audit.RootRequest)`:
 *    Invoked when verification requires root data. Should return `Audit.RootResponse`.
 */

import { Audit } from "../../types";
import { getMockAuditRecords } from "./data";
import { handle202Response } from "./utils";

// Interface is a subset of the props for AuditLogViewerProps.
// It includes only the callback function props that receive responses from the Pangea Audit service.
interface ProxyServerInterface {
  /** Called when the user performs a search. Should call /search on your server. */
  onSearch: (body: Audit.SearchRequest) => Promise<Audit.SearchResponse>;

  /** Called when the user navigates to a different page. Should call /results on your server. */
  onPageChange: (body: Audit.ResultRequest) => Promise<Audit.ResultResponse>;

  /** Called when the user requests a download. Should call /download_results on your server. */
  onDownload: (
    body: Audit.DownloadResultRequest
  ) => Promise<Audit.DownloadResultResponse>;

  /** Called to fetch root data for verification. Should call /root on your server. */
  onFetchRoot: (body: Audit.RootRequest) => Promise<Audit.RootResponse>;
}

/**
 * Retrieve optional Storybook environment variables for testing the component
 * against a deployed Pangea Audit Log service configuration; otherwise,
 * use mock data.
 */
const DOMAIN: string = import.meta.env.STORYBOOK_SERVICE_DOMAIN ?? "";
const SERVICE_TOKEN: string = import.meta.env.STORYBOOK_PANGEA_TOKEN ?? "";
const AUDIT_CONFIG_ID: string = import.meta.env.STORYBOOK_CONFIG_ID ?? "";

const isPangeaConnected = () => !!DOMAIN && !!SERVICE_TOKEN;

const getAuthorization = () => ({
  Authorization: `Bearer ${SERVICE_TOKEN}`,
});

const getServiceConfigParameter = () =>
  AUDIT_CONFIG_ID ? { config_id: AUDIT_CONFIG_ID } : {};

const getServer = () => `https://audit.${DOMAIN}`;

/**
 * TEST_SERVER serves as the main object implementing the ProxyServerInterface,
 * deciding whether to return mock or real (Pangea) data based on environment variables.
 */
export const TEST_SERVER: ProxyServerInterface = {
  onSearch: async (body) => {
    if (!isPangeaConnected()) {
      const records = getMockAuditRecords();
      return {
        id: "prq_mock-request-id",
        count: records.length,
        events: records,
        expires_at: new Date().toISOString(),
      };
    }

    return fetch(`${getServer()}/v1/search`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        verify_signature: true,
        ...getServiceConfigParameter(),
      }),
      headers: getAuthorization(),
    })
      .then(async (res) =>
        handle202Response(await res.json(), getAuthorization(), 5)
      )
      .then((response) => response?.result)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  onPageChange: async (body) => {
    if (!isPangeaConnected()) {
      const records = getMockAuditRecords();
      return {
        count: records.length,
        events: records,
      };
    }

    return fetch(`${getServer()}/v1/results`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        verify_signature: true,
        ...getServiceConfigParameter(),
      }),
      headers: getAuthorization(),
    })
      .then((res) => res.json())
      .then((response) => response?.result)
      .catch((err) => console.log(err));
  },

  onDownload: async (body) => {
    if (!isPangeaConnected()) {
      // The viewer expects a pre-signed URL from /download_results
      window.alert("Unable to download from mock example");
      return {
        dest_url: "",
      };
    }

    return fetch(`${getServer()}/v1/download_results`, {
      method: "POST",
      body: JSON.stringify({ ...body }),
      headers: getAuthorization(),
    })
      .then((res) => res.json())
      .then((response) => response?.result)
      .catch((err) => console.log(err));
  },

  onFetchRoot: async (body) => {
    if (!isPangeaConnected()) {
      // Verification requires real Audit Log data, mock mode returns null
      return {
        data: null,
      };
    }

    return fetch(`${getServer()}/v1/root`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        ...getServiceConfigParameter(),
      }),
      headers: getAuthorization(),
    })
      .then((res) => res.json())
      .then((response) => response?.result)
      .catch((err) => console.log(err));
  },
};
