import { it, expect } from "vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, type HttpResponseResolver } from "msw";

import PangeaConfig from "@src/config.js";
import EmbargoService from "@src/services/embargo.js";

function withRetriedRequestIds(
  retriedRequestIds: Set<string>,
  resolver: HttpResponseResolver
): HttpResponseResolver {
  return (args) => {
    const { request } = args;
    const rawRetryOfRequestIds = request.headers.get(
      "X-Pangea-Retried-Request-Ids"
    );

    if (rawRetryOfRequestIds === null) {
      return retriedRequestIds.size ? undefined : resolver(args);
    }

    const retryOfRequestIds = new Set(rawRetryOfRequestIds.split(","));

    if (
      retryOfRequestIds.size !== retriedRequestIds.size ||
      !Array.from(retryOfRequestIds).every((id) => retriedRequestIds.has(id))
    ) {
      return;
    }

    return resolver(args);
  };
}

const restHandlers = [
  // First failure.
  http.post(
    "http://127.0.0.1:4010/v1/ip/check",
    withRetriedRequestIds(new Set(), () => {
      return HttpResponse.json(
        {
          request_id: "prq_11111111111111111111111111111111",
          request_time: "2025-07-31T14:27:58.899758Z",
          response_time: "2025-07-31T14:27:59.659923Z",
          status: "InternalError",
          summary:
            "Internal Error. Contact support@pangea.cloud if the error persists.",
          result: null,
        },
        {
          status: 500,
          headers: { "x-request-id": "prq_11111111111111111111111111111111" },
        }
      );
    })
  ),

  // Second failure.
  http.post(
    "http://127.0.0.1:4010/v1/ip/check",
    withRetriedRequestIds(
      new Set(["prq_11111111111111111111111111111111"]),
      () => {
        return HttpResponse.json(
          {
            request_id: "prq_11111111111111111111111111111111",
            request_time: "2025-07-31T14:27:58.899758Z",
            response_time: "2025-07-31T14:27:59.659923Z",
            status: "InternalError",
            summary:
              "Internal Error. Contact support@pangea.cloud if the error persists.",
            result: null,
          },
          {
            status: 500,
            headers: { "x-request-id": "prq_22222222222222222222222222222222" },
          }
        );
      }
    )
  ),

  // Third attempt succeeds.
  http.post(
    "http://127.0.0.1:4010/v1/ip/check",
    withRetriedRequestIds(
      new Set([
        "prq_11111111111111111111111111111111",
        "prq_22222222222222222222222222222222",
      ]),
      () => {
        return HttpResponse.json(
          {
            request_id: "prq_33333333333333333333333333333333",
            request_time: "2025-07-31T14:27:58.899758Z",
            response_time: "2025-07-31T14:27:59.659923Z",
            status: "Success",
            summary: "Failed to find info for IP: 127.0.0.1",
            result: null,
          },
          {
            status: 200,
            headers: { "x-request-id": "prq_33333333333333333333333333333333" },
          }
        );
      }
    )
  ),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers());

it("should retry requests", async () => {
  const config = new PangeaConfig({ baseUrlTemplate: "http://127.0.0.1:4010" });
  const client = new EmbargoService("TEST_TOKEN", config);

  const response = await client.ipCheck("127.0.0.1");
  expect(response.request_id).toBe("prq_33333333333333333333333333333333");
  expect(response.status).toBe("Success");
});
