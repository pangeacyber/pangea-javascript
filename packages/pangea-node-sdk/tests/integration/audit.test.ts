import PangeaConfig from "../../src/config";
import AuditService from "../../src/services/audit";
import { Audit } from "../../src/types";
import { Signer } from "../../src/utils/signer";
import { jest, it, expect } from "@jest/globals";
import { PangeaErrors } from "../../src/errors";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";

const ACTOR = "node-sdk";
const MSG_NO_SIGNED = "test-message";
const MSG_JSON = "JSON-message";
const MSG_SIGNED_LOCAL = "sign-test-local";
const STATUS_NO_SIGNED = "no-signed";
const STATUS_SIGNED = "signed";
const signer = new Signer("./tests/testdata/privkey");

const JSON_NEW_DATA = {
  customtag3: "mycustommsg3",
  ct4: "cm4",
};

const JSON_OLD_DATA = {
  customtag5: "mycustommsg5",
  ct6: "cm6",
};
const environment = TestEnvironment.LIVE;
const token = getTestToken(environment);
const domain = getTestDomain(environment);
const config = new PangeaConfig({ domain: domain, customUserAgent: "sdk-test" });
const audit = new AuditService(token, config);
const auditWithTenantId = new AuditService(token, config, "mytenantid");

it("log an audit event. no verbose", async () => {
  const event: Audit.Event = {
    actor: ACTOR,
    message: MSG_NO_SIGNED,
    status: MSG_NO_SIGNED,
  };
  const response = await audit.log(event);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
  expect(response.result.envelope).toBeUndefined();
  expect(response.result.consistency_proof).toBeUndefined();
  expect(response.result.membership_proof).toBeUndefined();
  expect(response.result.consistency_verification).toBeUndefined();
  expect(response.result.membership_verification).toBeUndefined();
  expect(response.result.signature_verification).toBe("none");
});

it("log an audit event. verbose but no verify", async () => {
  const event: Audit.Event = {
    actor: ACTOR,
    message: MSG_NO_SIGNED,
    status: STATUS_NO_SIGNED,
  };

  const options: Audit.LogOptions = {
    verbose: true, // set verbose to true
  };

  const response = await audit.log(event, options);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
  expect(response.result.envelope).toBeDefined();
  expect(response.result.consistency_proof).toBeUndefined();
  expect(response.result.membership_proof).toBeDefined();
  expect(response.result.consistency_verification).toBeUndefined();
  expect(response.result.membership_verification).toBeUndefined();
  expect(response.result.signature_verification).toBe("none");
});

it("log an audit event with tenant_id", async () => {
  const event: Audit.Event = {
    actor: ACTOR,
    message: MSG_NO_SIGNED,
    status: STATUS_NO_SIGNED,
  };

  const options: Audit.LogOptions = {
    verbose: true, // set verbose to true
  };

  const response = await auditWithTenantId.log(event, options);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
  expect(response.result.envelope).toBeDefined();
  expect(response.result.consistency_proof).toBeUndefined();
  expect(response.result.membership_proof).toBeDefined();
  expect(response.result.consistency_verification).toBeUndefined();
  expect(response.result.membership_verification).toBeUndefined();
  expect(response.result.signature_verification).toBe("none");
  expect(response.result.envelope.event.tenant_id).toBe("mytenantid");
});

it("log an audit event. verbose and verify", async () => {
  const newAudit = new AuditService(token, config);

  const event: Audit.Event = {
    actor: ACTOR,
    message: MSG_NO_SIGNED,
    status: STATUS_NO_SIGNED,
  };

  const options: Audit.LogOptions = {
    verify: true, // Verify set verbose to true
  };

  let response = await newAudit.log(event, options);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
  expect(response.result.consistency_verification).toBe("none"); // First log cant verify consistency because there is not prev root
  expect(response.result.membership_verification).toBe("pass");
  expect(response.result.signature_verification).toBe("none");

  // Second log
  response = await newAudit.log(event, options);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
  expect(response.result.consistency_verification).toBe("pass"); //Should pass consistency verification bacause we still have a prev root
  expect(response.result.membership_verification).toBe("pass");
  expect(response.result.signature_verification).toBe("none");
});

it("log an audit event in JSON format", async () => {
  const options: Audit.LogOptions = {
    verbose: true,
  };

  const event: Audit.Event = {
    actor: ACTOR,
    message: MSG_JSON,
    status: STATUS_NO_SIGNED,
    new: JSON_NEW_DATA,
    old: JSON_OLD_DATA,
  };

  const response = await audit.log(event, options);

  expect(response.status).toBe("Success");
  expect(typeof response.result.hash).toBe("string");
  expect(typeof response.result?.envelope?.event?.message).toBe("string");
  expect(typeof response.result?.envelope?.event?.new).toBe("object");
  expect(typeof response.result?.envelope?.event?.old).toBe("object");

  const query = "message:" + MSG_JSON + " message: " + " status:" + STATUS_NO_SIGNED;
  const searchOptions: Audit.SearchOptions = {
    verifyConsistency: true,
  };

  const limit = 1;
  const maxResults = 1;
  const queryOptions: Audit.SearchParamsOptions = {
    limit: limit,
    max_results: maxResults,
  };

  const respSearch = await audit.search(query, queryOptions, searchOptions);
  expect(respSearch.result.count).toBe(maxResults);

  respSearch.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBe("pass");
    expect(record.signature_verification).toBe("none");
    expect(record.consistency_verification).toBe("none");
  });
});

it("log an event, local sign and verify", async () => {
  const event: Audit.Event = {
    message: MSG_SIGNED_LOCAL,
    source: "Source",
    status: "Status",
    target: "Target",
    actor: ACTOR,
    action: "Action",
    new: "New",
    old: "Old",
  };

  const respLog = await audit.log(event, {
    verbose: true,
    signer: signer,
    signMode: Audit.SignOptions.Local,
  });
  expect(respLog.status).toBe("Success");
  expect(typeof respLog.result.hash).toBe("string");

  const query = "message:" + MSG_SIGNED_LOCAL + " actor:" + ACTOR;
  const queryOptions: Audit.SearchParamsOptions = {
    limit: 1,
  };

  const respSearch = await audit.search(query, queryOptions, {});
  const searchEvent = respSearch.result.events[0];
  expect(searchEvent.signature_verification).toBe("pass");
  expect(searchEvent.envelope.public_key).toBe("lvOyDMpK2DQ16NI8G41yINl01wMHzINBahtDPoh4+mE=");
});

it("log an event, local sign and tenant id", async () => {
  const event: Audit.Event = {
    message: MSG_SIGNED_LOCAL,
    source: "Source",
    status: "Status",
    target: "Target",
    actor: ACTOR,
    action: "Action",
    new: "New",
    old: "Old",
  };

  const respLog = await auditWithTenantId.log(event, {
    verbose: true,
    signer: signer,
    signMode: Audit.SignOptions.Local,
  });
  expect(respLog.status).toBe("Success");
  expect(typeof respLog.result.hash).toBe("string");

  const query = "message:" + MSG_SIGNED_LOCAL + " actor:" + ACTOR;
  const queryOptions: Audit.SearchParamsOptions = {
    limit: 1,
  };

  const respSearch = await audit.search(query, queryOptions, {});
  const searchEvent = respSearch.result.events[0];
  expect(searchEvent.signature_verification).toBe("pass");
  expect(searchEvent.envelope.public_key).toBe("lvOyDMpK2DQ16NI8G41yINl01wMHzINBahtDPoh4+mE=");
});

it("log JSON event, sign and verify", async () => {
  const event: Audit.Event = {
    message: MSG_SIGNED_LOCAL,
    source: "Source",
    status: STATUS_SIGNED,
    target: "Target",
    actor: ACTOR,
    action: "Action",
    new: "New",
    old: "Old",
  };

  const respLog = await audit.log(event, {
    verbose: true,
    signer: signer,
    signMode: Audit.SignOptions.Local,
  });
  expect(respLog.status).toBe("Success");
  expect(typeof respLog.result.hash).toBe("string");
  expect(respLog.result.signature_verification).toBe("pass");

  const query = "message:" + MSG_SIGNED_LOCAL + " actor:" + ACTOR + " status:" + STATUS_SIGNED;
  const queryOptions: Audit.SearchParamsOptions = {
    limit: 1,
  };

  const respSearch = await audit.search(query, queryOptions, {});
  const searchEvent = respSearch.result.events[0];
  expect(searchEvent.signature_verification).toBe("pass");
  expect(searchEvent.envelope.public_key).toBe("lvOyDMpK2DQ16NI8G41yINl01wMHzINBahtDPoh4+mE=");
});

jest.setTimeout(20000);
it("search audit log and verify signature", async () => {
  const query = "message:" + MSG_SIGNED_LOCAL + " status:" + STATUS_SIGNED;
  const limit = 2;

  const queryOptions: Audit.SearchParamsOptions = {
    limit: limit,
    order: "asc",
  };

  const response = await audit.search(query, queryOptions, {});

  expect(response.status).toBe("Success");
  expect(response.result.events.length).toBeLessThanOrEqual(limit);
  response.result.events.forEach((record, index) => {
    expect(record.signature_verification).toBe("pass");
  });
});

jest.setTimeout(60000);
it("search audit log and verify consistency", async () => {
  const query = "message:";
  const limit = 2;
  const maxResults = 4;
  const options: Audit.SearchOptions = {
    verifyConsistency: true,
  };

  let queryOptions: Audit.SearchParamsOptions = {
    limit: limit,
    order: "asc", // Oldest events should have consistency proofs
    max_results: maxResults,
  };

  let response = await audit.search(query, queryOptions, options);
  expect(response.status).toBe("Success");
  expect(response.result.events.length).toBeLessThanOrEqual(limit);
  response.result.events.forEach((record, index) => {
    expect(record.consistency_verification).toBe("pass"); // Oldest events should pass
    expect(record.membership_verification).toBe("pass");
  });

  queryOptions.order = "desc"; // Newest events should not pass consistency proof

  response = await audit.search(query, queryOptions, options);

  expect(response.status).toBe("Success");
  expect(response.result.events.length).toBeLessThanOrEqual(limit);
  response.result.events.forEach((record, index) => {
    expect(record.consistency_verification).toBe("none"); // Newest events should not pass
    expect(record.membership_verification).toBe("pass");
  });
});

jest.setTimeout(20000);
it("search audit log and skip consistency verification", async () => {
  const query = "message:" + MSG_SIGNED_LOCAL;
  const limit = 2;

  const queryOptions: Audit.SearchParamsOptions = {
    limit: limit,
    order: "asc",
  };

  const response = await audit.search(query, queryOptions, {});

  expect(response.status).toBe("Success");
  expect(response.result.events.length).toBeLessThanOrEqual(limit);
  response.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBeUndefined(); // If not set verifyConsistency this remain undefined
    expect(record.consistency_verification).toBeUndefined();
    expect(record.signature_verification).toBe("pass");
  });
});

jest.setTimeout(20000);
it("results audit log with search verbose", async () => {
  const query = "message:";
  const searchLimit = 2;
  const searchMaxResults = 4;

  const queryOptions: Audit.SearchParamsOptions = {
    limit: searchLimit,
    max_results: searchMaxResults,
    order: "asc",
    verbose: true,
  };

  const searchResponse = await audit.search(query, queryOptions, {});
  expect(searchResponse.status).toBe("Success");
  expect(searchResponse.result.events.length).toBeLessThanOrEqual(searchLimit);
  searchResponse.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBeUndefined(); // If not set verifyConsistency this remain undefined
    expect(record.consistency_verification).toBeUndefined();
  });

  // Let's paginate.
  let resultsOptions: Audit.SearchOptions = {
    verifyConsistency: true, // First we'll check consistency
  };
  const resultsLimit = 2;

  let resultsResponse = await audit.results(
    searchResponse.result.id,
    resultsLimit,
    0,
    resultsOptions
  );
  expect(resultsResponse.status).toBe("Success");
  expect(resultsResponse.result.events.length).toEqual(resultsLimit);
  resultsResponse.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBe("pass");
    expect(record.consistency_verification).toBe("pass");
  });

  // Now we are going to skip consistency verification
  resultsOptions.verifyConsistency = false;

  resultsResponse = await audit.results(
    searchResponse.result.id,
    resultsLimit,
    resultsLimit,
    resultsOptions
  );
  expect(resultsResponse.status).toBe("Success");
  expect(resultsResponse.result.events.length).toEqual(resultsLimit);
  resultsResponse.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBeUndefined();
    expect(record.consistency_verification).toBeUndefined();
  });
});

jest.setTimeout(20000);
it("results audit log with search no verbose", async () => {
  const query = "message:";
  const searchLimit = 2;
  const searchMaxResults = 20;

  const queryOptions: Audit.SearchParamsOptions = {
    limit: searchLimit,
    max_results: searchMaxResults,
    order: "asc",
    verbose: false,
  };

  const searchResponse = await audit.search(query, queryOptions, {});
  expect(searchResponse.status).toBe("Success");
  expect(searchResponse.result.events.length).toBeLessThanOrEqual(searchLimit);
  searchResponse.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBeUndefined(); // If not set verifyConsistency this remain undefined
    expect(record.consistency_verification).toBeUndefined();
  });

  // Let's paginate.
  let resultsOptions: Audit.SearchOptions = {
    verifyConsistency: true, // First we'll try to check consistency
  };
  const resultsLimit = 2;

  let resultsResponse = await audit.results(
    searchResponse.result.id,
    resultsLimit,
    0,
    resultsOptions
  );
  expect(resultsResponse.status).toBe("Success");
  expect(resultsResponse.result.events.length).toEqual(resultsLimit);
  resultsResponse.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBe("none"); // It should be none because it does not have enought information
    expect(record.consistency_verification).toBe("none");
  });

  // Now we are going to skip consistency verification
  resultsOptions.verifyConsistency = false;

  resultsResponse = await audit.results(
    searchResponse.result.id,
    resultsLimit,
    resultsLimit,
    resultsOptions
  );
  expect(resultsResponse.status).toBe("Success");
  expect(resultsResponse.result.events.length).toEqual(resultsLimit);
  resultsResponse.result.events.forEach((record, index) => {
    expect(record.membership_verification).toBeUndefined();
    expect(record.consistency_verification).toBeUndefined();
  });
});

it("get audit root", async () => {
  const response = await audit.root();
  expect(response.status).toBe("Success");
  expect(response.result.data).toEqual(
    expect.objectContaining({
      published_at: expect.any(String),
      tree_name: expect.any(String),
      root_hash: expect.any(String),
      size: expect.any(Number),
      url: expect.any(String),
    })
  );
});

it("get audit root with tree size", async () => {
  const treeSize = 1;
  const response = await audit.root(treeSize);
  expect(response.status).toBe("Success");
  expect(response.result.data).toEqual(
    expect.objectContaining({
      published_at: expect.any(String),
      tree_name: expect.any(String),
      root_hash: expect.any(String),
      size: expect.any(Number),
      url: expect.any(String),
    })
  );
  expect(response.result.data.size).toBe(treeSize);
});

it("fail if empty message", async () => {
  const event: Audit.Event = {
    message: "",
  };
  try {
    const response = await audit.log(event);
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
    }
  }
});

it("fail bad auth token", async () => {
  const badaudit = new AuditService("pts_o45qb7xukiwob7sogf_notvalidtoken", config);

  const event: Audit.Event = {
    message: "mymessage",
  };
  try {
    const response = await badaudit.log(event);
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.UnauthorizedError);
    if (e instanceof PangeaErrors.UnauthorizedError) {
      expect(e.pangeaResponse.status).toBe("Unauthorized");
      expect(e.errors.length).toBe(0);
      expect(e.summary).toBe("Not authorized to access this resource");
    }
  }
});
