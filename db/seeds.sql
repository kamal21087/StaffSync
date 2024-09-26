INSERT INTO department (name) VALUES ('Engineering'), ('HR'), ('Sales');
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 1), ('Manager', 90000, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1);
