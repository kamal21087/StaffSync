import pool from './db'; // Ensure this path is correct based on your project structure
import inquirer from 'inquirer';

// Start application function (ensure this is properly defined in your main app file)
const startApp = () => {
  // Your startApp function logic to navigate back to the main menu
  console.log('Returning to the main menu...');
};

// View all departments
export const viewDepartments = async (): Promise<void> => {
  try {
    // Fetch all departments
    const res = await pool.query('SELECT id, name FROM department');

    // Format rows for cleaner display without (index)
    const formattedRows = res.rows.map((row) => ({
      ID: row.id,
      Name: row.name,
    }));

    // Display formatted rows
    console.table(formattedRows);
  } catch (error) {
    console.error('Error fetching departments:', error);
  } finally {
    startApp();
  }
};

// View all roles
export const viewRoles = async (): Promise<void> => {
  try {
    // Fetch all roles and their associated departments
    const res = await pool.query(`
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      JOIN department ON role.department_id = department.id
    `);

    // Format rows for cleaner display
    const formattedRows = res.rows.map((row) => ({
      ID: row.id,
      Title: row.title,
      Salary: row.salary,
      Department: row.department,
    }));

    // Display formatted rows
    console.table(formattedRows);
  } catch (error) {
    console.error('Error fetching roles:', error);
  } finally {
    startApp();
  }
};

// View all employees
export const viewEmployees = async (): Promise<void> => {
  try {
    // Fetch all employees along with their roles and departments
    const res = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
      COALESCE(m.first_name || ' ' || m.last_name, 'No Manager') AS manager
      FROM employee e
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);

    // Format rows for cleaner display
    const formattedRows = res.rows.map((row) => ({
      ID: row.id,
      FirstName: row.first_name,
      LastName: row.last_name,
      Title: row.title,
      Department: row.department,
      Salary: row.salary,
      Manager: row.manager,
    }));

    // Display formatted rows
    console.table(formattedRows);
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    startApp();
  }
};

// Add department
export const addDepartment = async (): Promise<void> => {
  try {
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    });

    // Insert the new department into the database
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database.`);
  } catch (error) {
    console.error('Error adding department:', error);
  } finally {
    startApp();
  }
};

// Add role
export const addRole = async (): Promise<void> => {
  try {
    // Fetch all departments to provide valid department IDs
    const departments = await pool.query('SELECT id, name FROM department');
    if (departments.rows.length === 0) {
      console.log('No departments available. Please add a department first.');
      return startApp();
    }

    // Prompt user for role details
    const { title, salary, department_id } = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Enter the role title:' },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary:',
        validate: (input) =>
          !isNaN(parseFloat(input)) && isFinite(parseFloat(input)) || 'Please enter a valid number without symbols (e.g., 120000)',
        filter: (input) => parseFloat(input),
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department ID:',
        choices: departments.rows.map((dept) => ({
          name: `${dept.name} (ID: ${dept.id})`,
          value: dept.id,
        })),
      },
    ]);

    // Insert the new role into the database
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
      title,
      salary,
      department_id,
    ]);
    console.log(`Added ${title} to the database.`);
  } catch (error) {
    console.error('Error adding role:', error);
  } finally {
    startApp();
  }
};

// Add employee
export const addEmployee = async (): Promise<void> => {
  try {
    // Fetch roles and managers for employee selection
    const roles = await pool.query('SELECT id, title FROM role');
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');

    // Prompt user for employee details
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      { type: 'input', name: 'first_name', message: 'Enter the first name:' },
      { type: 'input', name: 'last_name', message: 'Enter the last name:' },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role:',
        choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager (optional):',
        choices: [{ name: 'No Manager', value: null }, ...employees.rows.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        }))],
      },
    ]);

    // Insert the new employee into the database
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
      first_name,
      last_name,
      role_id,
      manager_id || null,
    ]);
    console.log(`Added ${first_name} ${last_name} to the database.`);
  } catch (error) {
    console.error('Error adding employee:', error);
  } finally {
    startApp();
  }
};

// Update employee role
export const updateEmployeeRole = async (): Promise<void> => {
  try {
    // Fetch employees and roles for selection
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const roles = await pool.query('SELECT id, title FROM role');

    // Prompt user to select employee and new role
    const { employee_id } = await inquirer.prompt({
      type: 'list',
      name: 'employee_id',
      message: 'Select an employee to update:',
      choices: employees.rows.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
    });

    const { role_id } = await inquirer.prompt({
      type: 'list',
      name: 'role_id',
      message: 'Select the new role:',
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    });

    // Update the employee's role in the database
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Error updating employee role:', error);
  } finally {
    startApp();
  }
};
