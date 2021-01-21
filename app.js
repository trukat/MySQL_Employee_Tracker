const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
const db = require("./db");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employeeTrackerDB",
});

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "actionInput",
        choices: [
          "View All Employees",
          "View All Roles",
          "Add Employee",
          "Add a Role",
          "Add Department",
          "Update Employee Role",
          "View All Employees by Department",
          "Exit",
        ],
      },
    ])
    .then((res) => {
      switch (res.actionInput) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add Department":
          addDept();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "View All Employees by Department":
          viewDepts();
          break;

        default:
          console.log(`Invalid action: ${res.actionInput}`);
          break;
      }
    });
};

start();

async function viewEmployees() {
  const employees = await db.findAllEmployees();
  console.log("\n");
  console.table(employees);
  start();
}

async function viewRoles() {
  const roles = await db.findAllRoles();
  console.log("\n");
  console.table(roles);
  start();
}

async function addEmployee() {
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
    `Success: ${employee.first_name} ${employee.last_name} added to the database`
  );
  start();
}

// async function addRole() {
//   const roles = await db.findAllRoles();

//   const roleChoices = roles.map(({ id, title }) => ({
//     name: title,
//     value: id,
//   }));

//   const role = await inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "title",
//         message: "What is the title for this role?",
//       }
//     ]);
//     const { salary } = await inquirer.prompt([{
//       {
//         type: "input",
//         name: "salary",
//         message: "What is this role's salary?",
//       },
//       {
//         type: "list",
//         name: "department_id",
//         message: "What department is this role being added to?",
//         choices: [1, 2, 3, 4],
//       },
//     ])
//     .then((res) => {
//       console.log("Success: New role added. \n");
//       connection.query(
//         "INSERT INTO role SET ?",
//         {
//           title: res.title,
//           salary: res.salary,
//           department_id: res.department_id,
//         },
//         (err, res) => {
//           if (err) throw err;
//           start();
//         }
//       );
//     });
// }

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptname",
        message: "Add new department name",
      },
    ])
    .then((res) => {
      console.log("Success: New department added. \n");
      connection.query(
        "INSERT INTO department SET ?",
        {
          deptname: res.deptname,
        },
        (err, res) => {
          if (err) throw err;
          start();
        }
      );
    });
};

async function updateRole() {
  const employees = await db.findAllEmployees();
  console.log(employees);
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
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

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  start();
}

async function viewDepts() {
  const depts = await db.findAllDepts();
  console.table(depts);
  start();
}

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
//   });
