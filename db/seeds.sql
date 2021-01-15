USE employeeTrackerDB;

INSERT INTO department (deptname)
VALUES ("Sales"), ("Legal"), ("Finance"), ("Engineering"); 

INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 150000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Sr Counsel", 110000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 125000, 3); 
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fred", "Jones", 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dapne", "Blake", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Velma", "Dinkley", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Shaggy", "Rogers", 3, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Scooby", "Doo", 2, 5);

-- SELECT DISTINCT department_id AS id, CONCAT(first_name, ' ', last_name) AS Employee, deptname as DeptName, title, salary
-- FROM department
-- INNER JOIN role ON department.id = department_id
-- INNER JOIN employee ON role.id = role_id;

-- SELECT department_id, deptname, title, salary 
-- FROM department
-- JOIN role ON department.id = department_id;

SELECT department_id as id, CONCAT(first_name, ' ', last_name) AS Employee, deptname as DeptName
FROM department
JOIN role ON department.id = department_id
JOIN employee ON role.id = role_id;

);