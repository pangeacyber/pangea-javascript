export const EmployeeStatus = {
  UNKNOWN: 1,
  CANDIDATE: 2,
  FULL_TIME: 3,
  CONTRACTOR: 4,
  TERMINATED: 5,
};

export function Employee() {
  this.employee_id = -1;
  this.first_name = "";
  this.last_name = "";
  this.company_email = "";
  this.personal_email = "";
  this.phone = "";
  this.date_of_birth = "";
  this.start_date = "";
  this.term_date = "";
  this.department = "";
  this.manager_id = -1;
  this.salary = 0;
  this.medical = "";
  this.profile_picture_path = "";
  this.dl_picture_path = "";
  this.ssn = "";
  this.status = EmployeeStatus.UNKNOWN;
}
