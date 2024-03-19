/**
 * MIT License
 *
 * Copyright (c) 2018-2022 Ignacio Mazzara
 * Copyright (c) 2024 Pangea Cyber Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

type Part = {
  contentDispositionHeader: string;
  contentTypeHeader: string;
  part: number[];
};

type Input = {
  filename: string;
  name?: string;
  type: string;
  data: Buffer;
};

enum ParsingState {
  INIT,
  READING_HEADERS,
  READING_DATA,
  READING_PART_SEPARATOR,
}

export function parse(multipartBodyBuffer: Buffer, boundary: string): Input[] {
  let lastLine = "";
  let contentDispositionHeader = "";
  let contentTypeHeader = "";
  let state: ParsingState = ParsingState.INIT;
  let buffer: number[] = [];
  const allParts: Input[] = [];

  let currentPartHeaders: string[] = [];

  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const oneByte: number = multipartBodyBuffer[i] ?? 0;
    const prevByte: number | null =
      i > 0 ? multipartBodyBuffer[i - 1] ?? 0 : null;
    // 0x0a => \n
    // 0x0d => \r
    const newLineDetected: boolean = oneByte === 0x0a && prevByte === 0x0d;
    const newLineChar: boolean = oneByte === 0x0a || oneByte === 0x0d;

    if (!newLineChar) lastLine += String.fromCharCode(oneByte);
    if (ParsingState.INIT === state && newLineDetected) {
      // searching for boundary
      if ("--" + boundary === lastLine) {
        state = ParsingState.READING_HEADERS; // found boundary. start reading headers
      }
      lastLine = "";
    } else if (ParsingState.READING_HEADERS === state && newLineDetected) {
      // parsing headers. Headers are separated by an empty line from the content. Stop reading headers when the line is empty
      if (lastLine.length) {
        currentPartHeaders.push(lastLine);
      } else {
        // found empty line. search for the headers we want and set the values
        for (const h of currentPartHeaders) {
          if (h.toLowerCase().startsWith("content-disposition:")) {
            contentDispositionHeader = h;
          } else if (h.toLowerCase().startsWith("content-type:")) {
            contentTypeHeader = h;
          }
        }
        state = ParsingState.READING_DATA;
        buffer = [];
      }
      lastLine = "";
    } else if (ParsingState.READING_DATA === state) {
      // parsing data
      if (lastLine.length > boundary.length + 4) {
        lastLine = ""; // mem save
      }
      if ("--" + boundary === lastLine) {
        const j = buffer.length - lastLine.length;
        const part = buffer.slice(0, j - 1);

        allParts.push(
          process({ contentDispositionHeader, contentTypeHeader, part })
        );
        buffer = [];
        currentPartHeaders = [];
        lastLine = "";
        state = ParsingState.READING_PART_SEPARATOR;
        contentDispositionHeader = "";
        contentTypeHeader = "";
      } else {
        buffer.push(oneByte);
      }
      if (newLineDetected) {
        lastLine = "";
      }
    } else if (ParsingState.READING_PART_SEPARATOR === state) {
      if (newLineDetected) {
        state = ParsingState.READING_HEADERS;
      }
    }
  }
  return allParts;
}

//  read the boundary from the content-type header sent by the http client
//  this value may be similar to:
//  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
export function getBoundary(header: string): string {
  const items = header.split(";");
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = new String(items[i]).trim();
      if (item.indexOf("boundary") >= 0) {
        const k = item.split("=");
        return new String(k[1]).trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return "";
}

function process(part: Part): Input {
  let input = {};

  const filename = getHeaderField(
    part.contentDispositionHeader,
    "filename",
    "defaultFilename"
  );
  if (filename) {
    Object.defineProperty(input, "filename", {
      value: filename,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  const parts = part.contentTypeHeader.split(":");
  const contentType = parts && parts[1] ? parts[1].trim() : "";
  if (contentType) {
    Object.defineProperty(input, "type", {
      value: contentType,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  const name = getHeaderField(
    part.contentDispositionHeader,
    "name",
    "defaultName"
  );
  // always process the name field
  Object.defineProperty(input, "name", {
    value: name,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(input, "data", {
    value: Buffer.from(part.part),
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return input as Input;
}

export function getHeaderField(
  header: string,
  field: string,
  defaultValue: string | undefined
): string | undefined {
  const parts = header.split(field + "=");
  if (parts.length > 1 && parts[1]) {
    const valueParts = parts[1].split(";");
    if (valueParts[0] !== undefined) {
      const value = valueParts[0].trim().replace(/['"]+/g, "");
      if (value.length > 0) {
        return value;
      }
    }
  }
  return defaultValue;
}
