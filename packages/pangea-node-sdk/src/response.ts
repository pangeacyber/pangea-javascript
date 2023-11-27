import type { Response } from "got";
import { AcceptedResult } from "./types.js";

const SupportedJSONFields = ["message", "new", "old"];

/**
 * Pangea Response object
 */

export class ResponseObject<M> {
  request_id: string = "InvalidPayloadReceived";
  request_time: string = "InvalidPayloadReceived";
  response_time: string = "InvalidPayloadReceived";
  status: string = "NoStatus";
  result: M = {} as M;
  accepted_result?: AcceptedResult;
  summary: string = "InvalidPayloadReceived";

  constructor(body: Object) {
    Object.assign(this, body);
  }
}

export class PangeaResponse<M> extends ResponseObject<M> {
  gotResponse: Response | undefined;
  success: boolean;

  constructor(response: Response) {
    const obj = JSON.parse(JSON.stringify(response.body), parseJSONfields);
    super(obj);
    this.gotResponse = response as Response;
    this.success = this.status === "Success";
    this.result = this.result == null ? ({} as M) : this.result;
    if (this.gotResponse.statusCode == 202) {
      this.accepted_result = this.result as AcceptedResult;
      this.result = {} as M;
    }
  }

  // Return raw Pangea API response body
  body() {
    return this.gotResponse?.body;
  }

  // Return SDK PangeaResponse object as JSON (excluded raw API response body)
  toJSON(): string {
    return JSON.stringify({ ...this, gotResponse: undefined }, null, "  ");
  }
}

function parseJSONfields(key: any, value: any) {
  if (SupportedJSONFields.includes(key) && typeof value === "string") {
    try {
      // @ts-ignore
      const obj = JSON.parse(value);
      return obj;
    } catch (e) {
      return value;
    }
  } else {
    return value;
  }
}

export default PangeaResponse;
