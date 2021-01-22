const connection = require('./connection');
require("console.table")

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    findAllEmployees() {
        return this.connection.query(
            "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, role.title, role.salary, department.deptname AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;"
        );
    }

    findAllRoles() {
        return this.connection.query(
            "SELECT department.id, title, deptname FROM department JOIN role ON department.id = department_id;"
        );
    }

    findAllDepts() {
        return this.connection.query(
            "SELECT * FROM department"
        );
    }

    createEmployee(employee) {
        return this.connection.query(
            "INSERT INTO employee SET ?", employee
        );
    }

    createRole(role) {
        return this.connection.query(
            "INSERT INTO role SET ?", role
        );
    }

    createDept(department) {
        return this.connection.query(
            "INSERT INTO department SET ?", department
        );
    }

    updateEmployeeRole(roleId, employeeId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        )
    }

    deleteEmployee(employee) {
        return this.connection.query(
            "DELETE FROM employee WHERE id = ?;", [employee]
        );
    }

    findEmpDepts() {
        return this.connection.query(
            "SELECT CONCAT(first_name, ' ', last_name) AS Employee, deptname as DeptName FROM department JOIN role ON department.id = department_id JOIN employee ON role.id = role_id ORDER BY DeptName DESC;"
        );
    }
}

module.exports = new DB(connection);