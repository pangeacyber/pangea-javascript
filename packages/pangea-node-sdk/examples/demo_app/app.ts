/* eslint-disable no-console */
import DB from "./utils/db";
import { Employee, EmployeeStatus } from "./utils/employee";

import PangeaConfig from "../../src/config";
import EmbargoService from "../../src/services/embargo";
import AuditService from "../../src/services/audit";
import RedactService from "../../src/services/redact";

// Setup Pangea dependencies
const TOKEN = process.env.PANGEA_TOKEN;
const PANGEA_DOMAIN = process.env.PANGEA_DOMAIN;

const embargoConfig = new PangeaConfig({
  domain: PANGEA_DOMAIN,
});
const embargo = new EmbargoService(TOKEN, embargoConfig);

const auditConfig = new PangeaConfig({
  domain: `${PANGEACSP}.pangea.cloud`,
});
const audit = new AuditService(TOKEN, auditConfig);

const redactConfig = new PangeaConfig({
  domain: `${PANGEACSP}.pangea.cloud`,
});
const redact = new RedactService(TOKEN, redactConfig);

// Primary logic of Demo App.
// Interacts with Pangea SDK, stores data to local sqlite file
class App {
  constructor() {
    this.store = new DB();
  }

  shutdown() {
    this.store.shutdown();
  }

  async setup() {
    console.log("[App.setup]");
    // eslint-disable-next-line no-return-await
    return await this.store.setupEmployeeTable();
  }

  async uploadResume(user, clientIp, data) {
    console.log("[App.uploadResume] processing request from: ", user, clientIp, data);

    // Embargo check on submission client IP address, disallow sanctioned countries
    const response = await embargo.ipCheck(clientIp);

    console.log("[App.uploadResume] Embargo response: ", response?.code, response?.result);

    if (response?.result.count > 0) {
      // Audit log
      const auditData = {
        action: "add_employee",
        actor: user,
        target: data.email,
        status: "error",
        message: `Resume denied - sanctioned country from ${clientIp}`,
        source: "web",
      };

      const logResponse = await audit.log(auditData);

      if (logResponse.success) {
        console.log("[App.uploadResume] Audit log success:", logResponse.result);
      } else {
        console.log("[App.uploadResume] Audit log Error:", logResponse.code, logResponse.result);
      }
      return [403, "Submission from sanctioned country not allowed"];
    }

    // add to DB
    const candidate = new Employee();
    candidate.first_name = data.first_name;
    candidate.last_name = data.last_name;
    candidate.personal_email = data.email;
    candidate.phone = data.phone;
    candidate.date_of_birth = data.dob;
    candidate.ssn = data.ssn;
    candidate.status = EmployeeStatus.CANDIDATE;

    const ret = await this.store.addEmployee(candidate);

    console.log("[App.uploadResume] Add to database: ", ret);

    // Redact before audit logging
    const redactResponse = await redact.redactStructured(data);

    if (redactResponse.code === 200) {
      console.log("[App.uploadResume] Redact success:", redactResponse.data);

      // Audit log
      const auditData = {
        action: "add_employee",
        actor: user,
        target: data.email,
        status: ret ? "success" : "error",
        message: ret ? "resume accepted" : "resume denied",
        new: redactResponse.result,
        source: "web",
      };

      const logResponse = await audit.log(auditData);

      if (logResponse.code === 200) {
        console.log("[App.uploadResume] Audit log success:", logResponse.result);
      } else {
        console.log("[App.uploadResume] Audit log Error:", logResponse.code, logResponse.result);
      }
    } else {
      console.log("[App.uploadResume] Redact Error:", redactResponse.code, redactResponse.result);

      // Audit log
      const auditData = {
        action: "add_employee",
        actor: user,
        target: data.email,
        status: ret ? "success" : "error",
        // eslint-disable-next-line no-constant-condition
        message: "resume accepted - redaction failed" ? ret : "resume denied - redaction failed",
        source: "web",
      };

      const logResponse = await audit.log(auditData);

      if (logResponse.code === 200) {
        console.log("[App.uploadResume] Audit log success:", logResponse.result);
      } else {
        console.log("[App.uploadResume] Audit log Error:", logResponse.code, logResponse.result);
      }
    }

    const code = ret ? 201 : 400;
    const message = ret ? "Resume accepted" : "Bad request";

    return [code, message];
  }

  async fetchEmployeeRecord(user, email) {
    console.log("[App.fetchEmployeeRecord] processing: ", user, email);

    const emp = await this.store.lookupEmployee(email);

    // Audit log
    const auditData = {
      action: "lookup_employee",
      actor: user,
      target: email,
      status: emp ? "success" : "error",
      message: "Requested employee record",
      source: "web",
    };

    const logResponse = await audit.log(auditData);

    if (logResponse.code === 200) {
      console.log("[App.fetchEmployeeRecord] Audit log success:", logResponse.result);
    } else {
      console.log(
        "[App.fetchEmployeeRecord] Audit log error: ",
        logResponse.code,
        logResponse.result
      );
    }

    const code = emp ? 200 : 400;

    return { code, emp };
  }

  async updateEmployee(user, data) {
    console.log("[App.updateEmployee] processing: ", user, data);

    // fetch the old employee record
    const oldEmp = await this.store.lookupEmployee(data.email);

    if (oldEmp) {
      const newEmp = { ...oldEmp, ...data }; // keeping old_emp around for audit logging

      newEmp.employee_id = oldEmp.id;

      // update database record
      const ret = await this.store.updateEmployee(newEmp);

      console.log(`[App.updateEmployee] Update employee record: ${ret}`);

      // Audit log
      const auditData = {
        action: "update_employee",
        actor: user,
        target: data.email,
        status: ret ? "success" : "error",
        message: ret ? "Record updated" : "Failed to update record",
        old: oldEmp,
        new: newEmp,
        source: "web",
      };

      const logResponse = await audit.log(auditData);

      if (logResponse.code === 200) {
        console.log("[App.updateEmployee] Audit log success:", logResponse.result);
      } else {
        console.log("[App.updateEmployee] Audit log error: ", logResponse.code, logResponse.result);
      }

      return [
        ret ? 200 : 500,
        ret ? "Successfully updated employee record" : "Database update error",
      ];
    }
    return [404, "Employee not found"];
  }
}

export default App;
