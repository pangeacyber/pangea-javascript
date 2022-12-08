/* eslint-disable no-console */
import sqlite3 from "sqlite3";

class DB {
  db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("demo-app.db", (err) => {
      if (err) {
        console.log("[DB] could not connect to database ", err);
      } else {
        console.log("[DB] Connected to database");
      }
    });
  }

  shutdown() {
    this.db.close();
    console.log("[DB.shutdown]");
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line func-names
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(err);
        }
      });
    });
  }

  get(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line func-names
      this.db.get(sql, params, function (err, row) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async setupEmployeeTable() {
    const query = `CREATE TABLE employee (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        company_email TEXT,
        personal_email TEXT,
        phone TEXT,
        date_of_birth TEXT,
        start_date TEXT,
        term_date TEXT,
        department TEXT,
        manager INTEGER,
        salary INTEGER,
        medical TEXT,
        profile_picture BLOB,
        dl_picture BLOB,
        ssn TEXT,
        status INTEGER,
        FOREIGN KEY(manager) REFERENCES employee(id))`;

    try {
      await this.run(query);
    } catch (e) {
      console.log("[DB.setupEmployeeTable] datastore error");
      return false;
    }

    const idxquery = `CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_pemail
        ON employee (personal_email)`;

    try {
      await this.run(idxquery);
    } catch (e) {
      console.log("[DB.setupEmployeeTable] idx creation error");
      return false;
    }
    return true;
  }

  async addEmployee(emp) {
    console.log("[DB.add_employee] Processing: ", emp);

    const query = `INSERT INTO employee (first_name, last_name, personal_email, phone, 
      date_of_birth, ssn, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
      await this.run(query, [
        emp.first_name,
        emp.last_name,
        emp.personal_email,
        emp.phone,
        emp.date_of_birth,
        emp.ssn,
        emp.status,
      ]);
    } catch (e) {
      console.log("[DB.add_employee] datastore error: ", e);
      return false;
    }
    return true;
  }

  async lookupEmployee(email) {
    console.log("[DB.lookupEmployee] Processing: ", email);

    const query = `SELECT first_name, last_name, company_email, personal_email,
      date_of_birth, start_date, term_date, department, manager, salary, medical,
      ssn, status, id 
      FROM employee 
      WHERE personal_email=? OR company_email=?`;

    let row = null;

    try {
      row = await this.get(query, [email, email]);
    } catch (e) {
      console.log("[DB.lookupEmployee] datastore error: ", e);
    }

    return row;
  }

  async updateEmployee(emp) {
    console.log("[DB.updateEmployee] Processing: ", emp);

    const query = `UPDATE employee 
      SET company_email = ?,
          start_date = ?,
          term_date = ?,
          department = ?,
          manager = ?,
          salary = ?,
          status = ?
      WHERE id = ?`;

    try {
      await this.run(query, [
        emp.company_email,
        emp.start_date,
        emp.term_date,
        emp.department,
        emp.manager_id,
        emp.salary,
        emp.status,
        emp.employee_id,
      ]);
    } catch (e) {
      console.log("[DB.updateEmployee] datastore error: ", e);
      return false;
    }
    return true;
  }
}

export default DB;
