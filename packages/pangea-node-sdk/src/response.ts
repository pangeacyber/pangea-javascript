import type { Response } from "got";
import { AcceptedResult } from "./types.js";
import { getBoundary, parse } from "./utils/multipart.js";
import * as path from "path";
import fs from "fs";

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

export class AttachedFile {
  filename: string;
  file: Buffer;
  contentType: string;

  constructor(filename: string, file: Buffer, contentType: string) {
    this.filename = filename;
    this.file = file;
    this.contentType = contentType;
  }

  save(destFolder?: string, filename?: string) {
    if (!destFolder) {
      destFolder = ".";
    }
    if (!filename) {
      filename = this.filename ? this.filename : "defaultName.txt";
    }
    if (!fs.existsSync(destFolder)) {
      // If it doesn't exist, create it
      fs.mkdirSync(destFolder, { recursive: true });
    }

    const filepath = path.resolve(destFolder, filename);
    fs.writeFileSync(filepath, this.file);
  }
}

export class PangeaResponse<M> extends ResponseObject<M> {
  gotResponse?: Response;
  success: boolean;
  attachedFiles: AttachedFile[] = [];

  constructor(response: Response) {
    let jsonResp = {};
    let attachedFilesTemp: AttachedFile[] = [];

    if (
      response.headers["content-type"] &&
      response.headers["content-type"].includes("multipart")
    ) {
      const boundary = getBoundary(response.headers["content-type"]);
      const parts = parse(response.rawBody, boundary);
      parts.forEach((part, index) => {
        if (index == 0) {
          jsonResp = JSON.parse(part.data.toString("utf-8"));
        } else {
          attachedFilesTemp.push(new AttachedFile(part.filename, part.data, part.type));
        }
      });
    } else {
      jsonResp = JSON.parse(JSON.stringify(response.body), parseJSONfields);
    }
    super(jsonResp);
    this.attachedFiles = attachedFilesTemp;
    this.gotResponse = response;

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
