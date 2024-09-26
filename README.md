# **StaffSync**

StaffSync is a command-line application that helps business owners manage their company's employee database. Built using Node.js, Inquirer, and PostgreSQL, it allows users to view and manage departments, roles, and employees within their company database.

## **Table of Contents**

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Commands](#commands)
- [Contributing](#contributing)
- [License](#license)

## **Features**

- View all departments, roles, and employees in a formatted table.
- Add new departments, roles, and employees to the database.
- Update employee roles.
- Interactive prompts guide the user through each action.

## **Installation**

### **Prerequisites**

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [PostgreSQL](https://www.postgresql.org/) (v14 or later)

### **Clone the Repository**

Clone the project to your local machine:

```bash
git clone https://github.com/kamal21087/StaffSync.git
cd StaffSync
```

### **Installation Dependencies**
Navigate to the project directory and install the necessary dependencies:
```bash 
npm install
```
### **Set Up the Database**
1. **Create the Database**:
Use PostgreSQL to create the ```your``` database:

```bash
psql -U postgres
CREATE DATABASE name-of-your-database;
```
2. **Create the Tables**:
Execute the schema.sql file to create the necessary tables:

```bash
psql -U username -d name-of-your-database -f db/schema.sql
```
3. **Optional: Seed the Database**:
You can pre-populate your database with sample data by executing the seeds.sql file:

```bash
psql -U username -d name-of-your-database -f db/seeds.sql
```
**Configure Environment Variables**
Create a `.env` file in the root directory of the project and add your database configuration:

```bash
DB_USER=your-username             # Or use 'postgres' if you prefer the superuser
DB_HOST=localhost         # The host of your PostgreSQL server, usually localhost
DB_NAME=name-of-your-database             # The name of the database you created
DB_PASS=your-pwd   # The password for the 'kamal' user or 'postgres'
DB_PORT=5432              # Default PostgreSQL port
```
### **Usage**
Run the application using Node.js:

```bash
npx ts-node src/app.ts
```
### **Navigation**
When you start the application, you will be presented with the following options:

**View All Departments**: Displays a list of all departments and their IDs.

**View All Roles**: Displays all roles, including the job title, role ID, department, and salary.

**View All Employees**: Displays all employees, including their ID, first and last name, job title, department, salary, and manager.

**Add Department**: Prompts you to enter the name of a new department to add to the database.

**Add Role**: Prompts you to enter the title, salary, and department for a new role.

**Add Employee**: Prompts you to enter the first name, last name, role, and manager for a new employee.

**Update Employee Role**: Allows you to select an employee and update their role.

## **Database Schema**
The database contains three main tables:

**Department**

`id`: SERIAL PRIMARY KEY
`name`: VARCHAR(30) UNIQUE NOT NULL

**Role**

`id`: SERIAL PRIMARY KEY
`title`: VARCHAR(30) UNIQUE NOT NULL
`salary`: DECIMAL NOT NULL
`department_id`: INTEGER NOT NULL (references department)

**Employee**

`id`: SERIAL PRIMARY KEY
`first_name`: VARCHAR(30) NOT NULL
`last_name`: VARCHAR(30) NOT NULL
`role_id`: INTEGER NOT NULL (references role)
`manager_id`: INTEGER (references employee)

### **Commands**
**Add Department**: Creates a new department.

**Add Role**: Adds a new role, specifying its salary and associated department.

**Add Employee**: Adds a new employee, specifying their role and manager.

**View Commands**: Allows you to view departments, roles, and employees.

**Update Employee Role**: Updates an employee’s role.

### **Contributing**
Contributions are welcome! If you have any suggestions or improvements, please submit a pull request or open an issue.

### **License**
TBD. 
