const mysql = require("mysql");
const inquirer = require("inquirer");
const consTable = require("console.table");

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
          addDepartment();
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

const viewEmployees = () => {
  let sqlquery =
    "SELECT DISTINCT department_id AS id, CONCAT(first_name, ' ', last_name) AS Employee, deptname as DeptName, title, salary ";
  sqlquery += "FROM department ";
  sqlquery += "INNER JOIN role ";
  sqlquery += "ON department.id = department_id ";
  sqlquery += "INNER JOIN employee ";
  sqlquery += "ON role.id = role_id; ";
  console.log("List of all current employees. \n");
  connection.query(sqlquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    return res;
  });
  start();
};

const viewRoles = () => {
  let sqlquery = "SELECT title, salary ";
  sqlquery += "FROM department ";
  sqlquery += "JOIN role ";
  sqlquery += "ON department.id = department_id ";
  console.log("List of current roles. \n");
  connection.query(sqlquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const addEmployee = () => {
  inquirer
    .prompt([
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
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role ID?",
        choices: [1, 2, 3, 4, 5],
      },
      {
        type: "list",
        name: "manager_id",
        message: "What is the new employee's Manager ID?",
        choices: [001, 003, 004, 005],
      },
    ])
    .then((res) => {
      console.log(res);
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: res.first_name,
          last_name: res.last_name,
          role_id: res.role_id,
          manager_id: res.manager_id,
        },
        (err) => {
          if (err) throw err;
          console.log(
            `Success: ${res.first_name} ${res.last_name} added to the database`
          );
          start();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
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
      {
        type: "list",
        name: "department_id",
        message: "What department is this role being added to?",
        choices: [1, 2, 3, 4],
      },
    ])
    .then((res) => {
      console.log("Success: New role added. \n");
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: res.title,
          salary: res.salary,
          department_id: res.department_id,
        },
        (err, res) => {
          if (err) throw err;
          start();
        }
      );
    });
};

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
    const employees = await viewEmployees();
    console.log (employees);
    const employeeChoices = employees.map(({
        id, first_name, last_name
    }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const {employeeID} = await inquirer.prompt([
        {
            type: "list",
            name: "employeeID",
            message: "Which employees' role do you want to update?",
            choices: employeeChoices
        }
    ])
    console.table(employees);
}

const viewDepts = () => {
    let sqlquery = "SELECT department_id as id, deptname as DeptName, CONCAT(first_name, ' ', last_name) AS Employee ";
    sqlquery += "FROM department ";
    sqlquery += "JOIN role ";
    sqlquery += "ON department.id = department_id ";
    sqlquery += "JOIN employee ";
    sqlquery += "ON role.id = role_id ";
    sqlquery += "ORDER BY DeptName ";
    sqlquery += "DESC ";
    console.log("List of current employees by department. \n");
    connection.query(sqlquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
//   });
