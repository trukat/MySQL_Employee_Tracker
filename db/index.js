const connection = require('./connection');
const inquirer = require("inquirer");
const cTable = require("console.table");

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    findAllEmployees() {
        return this.connection.query(
            "SELECT DISTINCT department_id AS id, CONCAT(first_name, ' ', last_name) AS Employee, deptname as DeptName, title, salary FROM department JOIN role ON department.id = department_id JOIN employee ON role.id = role_id;"
        );
    }

    findAllRoles() {
        return this.connection.query(
            "SELECT department_id, deptname, title, salary FROM department JOIN role ON department.id = department_id;"
        );
    }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        )
    }

    findAllDepts() {
        return this.connection.query(
            "SELECT department_id as id, CONCAT(first_name, ' ', last_name) AS Employee, deptname as DeptName FROM department JOIN role ON department.id = department_id JOIN employee ON role.id = role_id ORDER BY DeptName DESC;"
        );
    }
}

module.exports = new DB(connection);