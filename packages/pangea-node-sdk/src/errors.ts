import { Audit } from "types.js";
import { PangeaResponse } from "./response.js";

export namespace PangeaErrors {
  export interface ErrorField {
    code: string;
    detail: string;
    source: string;
    path?: string;
  }

  export class PangeaError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PangeaGeneralError";
    }
  }

  export class AuditError extends PangeaError {
    constructor(message: string) {
      super(message);
      this.name = "PangeaAuditError";
    }
  }

  export class AuditEventError extends AuditError {
    envelope: Audit.EventEnvelope;

    constructor(message: string, envelope: Audit.EventEnvelope) {
      super(message);
      this.name = "PangeaAuditEventError";
      this.envelope = envelope;
    }
  }

  export interface Errors {
    errors: ErrorField[];
  }

  export class APIError extends Error {
    response: PangeaResponse<Errors>;

    constructor(message: string, response: PangeaResponse<any>) {
      super(message);
      this.name = "PangeanAPIError";
      response.result = response.result as Errors;
      this.response = response;
    }

    get pangeaResponse(): any {
      return this.response;
    }

    get summary(): string {
      return this.response.summary;
    }

    get errors(): ErrorField[] {
      return this.response.result?.errors || ([] as ErrorField[]);
    }

    toString(): string {
      let ret = "";
      ret += this.response.summary + "\n";
      (this.response.result?.errors || []).forEach((ef) => {
        ret += "\t" + ef.detail + "\n";
      });
      return ret;
    }
  }

  //Pangea Validation Errors denoting issues with an API request
  export class ValidationError extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "ValidationError";
    }
  }

  //Too many requests were made
  export class RateLimiteError extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "RateLimiteError";
    }
  }

  //API usage requires payment"""
  export class NoCreditError extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "NoCreditError";
    }
  }

  //User is not authorized to access a given resource
  export class UnauthorizedError extends APIError {
    constructor(serviceName: string, response: PangeaResponse<any>) {
      let message = "User is not authorized to access service " + serviceName;
      super(message, response);
      this.name = "UnauthorizedError";
    }
  }

  // Service not enabled
  export class ServiceNotEnabledError extends APIError {
    constructor(serviceName: string, response: PangeaResponse<any>) {
      let message =
        String(serviceName) +
        " is not enabled. Go to console.pangea.cloud/service/{service_name} to enable";
      super(message, response);
      this.name = "ServiceNotEnabledError";
    }
  }

  // No config ID was provided in either token scopes or explicitly
  export class MissingConfigID extends APIError {
    constructor(serviceName: string, response: PangeaResponse<any>) {
      let message =
        "Token did not contain a config scope for service " +
        serviceName +
        ". Create a new token or provide a config ID explicitly in the service base";
      super(message, response);
      this.name = "ServiceNotEnabledError";
    }
  }

  // Downstream provider error
  export class ProviderError extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "ProviderError";
    }
  }

  // A pangea service error
  export class InternalServiceErrorError extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "InternalServiceError";
    }
  }

  // Service is not currently available
  export class ServiceNotAvailableError extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "ServiceNotAvailableError";
    }
  }

  export class InvalidPayloadReceived extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "InvalidPayloadReceived";
    }
  }

  export class ForbiddenVaultOperation extends APIError {
    constructor(message: string, response: PangeaResponse<any>) {
      super(message, response);
      this.name = "ForbiddenVaultOperation";
    }
  }
}
