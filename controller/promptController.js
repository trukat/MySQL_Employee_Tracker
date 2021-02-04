const inquirer = require("inquirer");
const connection = require("../db/connection");
const db = require("../db");

module.exports = {
  startMenu: async function () {
    const { actionInput } = await inquirer.prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "actionInput",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Add Employee",
          "Add a Role",
          "Add Department",
          "Update Employee Role",
          "Remove Employee",
          "View All Employees by Department",
          "Exit",
        ],
      },
    ]);
    console.log(actionInput);

    switch (actionInput) {
      case "View All Employees":
        this.viewEmployees();
        break;

      case "View All Roles":
        this.viewRoles();
        break;

      case "View All Departments":
        this.viewDepts();
        break;

      case "Add Employee":
        this.addEmployee();
        break;

      case "Add a Role":
        this.addRole();
        break;

      case "Add Department":
        this.addDept();
        break;

      case "Update Employee Role":
        this.updateRole();
        break;

      case "Remove Employee":
        this.removeEmployee();
        break;

      case "View All Employees by Department":
        this.viewEmpDepts();
        break;

      default:
        process.exit();
        break;
    }
  },


viewEmployees: async function () {
  const employees = await db.findAllEmployees();
  console.log("\n");
  console.table(employees);
  this.startMenu();
},

viewRoles: async function () {
  const roles = await db.findAllRoles();
  console.log("\n");
  console.table(roles);
  this.startMenu();
},

viewDepts: async function () {
  const departments = await db.findAllDepts();
  console.log("\n");
  console.table(departments);
  this.startMenu();
},

addEmployee: async function () {
  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const managers = await db.findAllEmployees();
  const managerChoices = managers.map(({ id, Employee }) => ({
    name: Employee,
    value: id,
  }));

  const employee = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);
  const { roleID } = await inquirer.prompt([
    {
      type: "list",
      name: "roleID",
      message: "What is the employee's role?",
      choices: roleChoices,
    },
  ]);
  employee.role_id = roleID;
  const { managerID } = await inquirer.prompt([
    {
      type: "list",
      name: "managerID",
      message: "What is the new employee's manager?",
      choices: managerChoices,
    },
  ]);
  employee.manager_id = managerID;
  await db.createEmployee(employee);
  console.log(
    `Success: ${employee.first_name} ${employee.last_name} added to the database. \n`
  );
  this.startMenu();
},

addRole: async function () {
  const department = await db.findAllDepts();

  const deptChoices = department.map(({ id, deptname }) => ({
    name: deptname,
    value: id,
  }));

  const role = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title for this role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is this role's salary?",
    },
  ]);
  const { deptID } = await inquirer.prompt([
    {
      type: "list",
      name: "deptID",
      message: "What department is this role being added to?",
      choices: deptChoices,
    },
  ]);
  role.department_id = deptID;
  await db.createRole(role);
  console.log("Success: New role added. \n");
  this.startMenu();
},

addDept: async function () {
  const department = await inquirer.prompt([
    {
      type: "input",
      name: "deptname",
      message: "Add new department name",
    },
  ]);
  await db.createDept(department);
  console.log("Success: New department added. \n");
  this.startMenu();
},

updateRole: async function () {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, Employee }) => ({
    name: Employee,
    value: id,
  }));
  const { employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employees' role do you want to update?",
      choices: employeeChoices,
    },
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices,
    },
  ]);

  await db.updateEmployeeRole(roleId, employeeId);

  console.log("Updated employee's role");
  this.startMenu();
},

removeEmployee: async function () {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, Employee }) => ({
    name: Employee,
    value: id,
  }));

  const employee = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to remove?",
      choices: employeeChoices,
    },
  ]);
  id = employee;
  await db.deleteEmployee(employee.employeeId);
  console.log("Success: Employee removed from the database. \n");
  this.startMenu();
},


viewEmpDepts: async function () {
  const depts = await db.findEmpDepts();
  console.table(depts);
  this.startMenu();
},
};