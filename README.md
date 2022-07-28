# HSP-Clinic-Server


## Setting-Up
### Prerequisits:
make sure to download the following

1) git (https://github.com/git-guides/install-git)
2) node.js (https://nodejs.org/)
3) Visual Studio Code (https://code.visualstudio.com/)
4) MySQL Community Server (https://dev.mysql.com/downloads/mysql/)
5) MySQL Workbench (https://dev.mysql.com/downloads/workbench/)

## Step 1 - Setting up the SQL Data Base

1) Create a SQL server on your local machine
2) Create a new schema and name it as you wish (e.g. hsp_group).
3) Set the created schema to be the default and then create the following tables by running the associated commands below.
4) Create addresses table: 
  `CREATE TABLE ‘addresses’ (
  ‘id’ int NOT NULL AUTO_INCREMENT,
  ‘address_description’ longtext NOT NULL,
  PRIMARY KEY (‘id’)
  ) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
3) Create allergies table:
   `CREATE TABLE ‘allergies’ (
  ‘id’ int NOT NULL AUTO_INCREMENT,
  ‘allergy_description’ longtext,
  PRIMARY KEY (‘id’),
  UNIQUE KEY ‘id_UNIQUE’ (‘id’)
  ) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
3) Create user_verifications table:
   `CREATE TABLE ‘user_verifications’ (
  ‘id’ bigint NOT NULL AUTO_INCREMENT,
  ‘user_id’ bigint NOT NULL,
  ‘unique_string’ varchar(80) NOT NULL,
  PRIMARY KEY (‘id’),
  UNIQUE KEY ‘user_id_UNIQUE’ (‘user_id’),
  UNIQUE KEY ‘unique_string_UNIQUE’ (‘unique_string’)
  ) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
4) create users table:
   `CREATE TABLE ‘users’ (
  ‘id’ bigint NOT NULL AUTO_INCREMENT,
  ‘first_name’ varchar(45) NOT NULL,
  ‘last_name’ varchar(45) NOT NULL,
  ‘student_number’ varchar(13) NOT NULL,
  ‘email’ varchar(50) NOT NULL,
  ‘password’ varchar(80) NOT NULL,
  ‘phone_number’ varchar(13) NOT NULL,
  ‘allergies’ varchar(255) DEFAULT NULL,
  ‘address’ varchar(255) DEFAULT NULL,
  ‘gender’ char(1) DEFAULT NULL,
  ‘DOB’ date DEFAULT NULL,
  ‘validated’ int NOT NULL DEFAULT '0',
  PRIMARY KEY (‘id’),
  UNIQUE KEY ‘id’ (‘id’),
  UNIQUE KEY ‘email’ (‘email’),
  UNIQUE KEY ‘student_number’ (‘student_number’)
  ) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`

## Step 2 - Setting up the Environment variables (.env)

1) Create a new file in the project directory and name it `.env`
2) Type the following in the .env file:
  ` DB_PASS=<value>
    DB_USER=<value>
    DB_PORT=<value>
    DB_HOST=<value>
    DB=<value>
    SENDGRID_API_KEY=<value>
    TOKEN_SECRET=<value>
    REFRESH_TOKEN_SECRET=<value>`. No commas, new-line delimited; replace `<value>` with the respective value. This is to ensure that sensitive information isnt visible within the source code... and why I am not displaying values here either, contact me directly for the `SENDGRID_API_KEY`. Ref 'Google Dorking .env'.

## Step 3 - Cloning the Repository

1) In your terminal navigate to the directory you wish to clone the project to 
2) Execute the following command: `git clone https://github.com/iiAmVonney/HSP-Clinic-Server.git`
3) Navigate into the cloned project directory; you can confirm if the directory is correct if it has a hidden '.git' file (enable 'show hidden files' on your file explorer if you havent already) and Open Visual Studio Code in the directory 
    ### DO NOT make any edits yet!!
5) In your terminal run the `git status` command to ensure that you have cloned the repo succesfuly and are currently in the 'main' branch.
6) Before making any edits, run the command `git checkout -b <your-branch-name>` in your terminal and replace `<your-branch-name>` with what you would like to name your branch.
7) Confirm that you are now in your new branch by running the `git status` command in your terminal. You can also view the branch you are currently working in, in the BOTTOM LEFT CORNER of VS Code: 
![image](https://user-images.githubusercontent.com/86348684/181617016-17c657b1-ff43-40c6-87ec-77d27ebf9052.png)

8) After confirming that you are in your branch run the command `npm i` in you terminal.

## Step 5 - NB!! Making Changes

1) Before making any changes to the source code make sure you are not in the `main` branch!
2) Run `git status` to ascertain what branch you are in.
3) If you are not in your branch, create your branch using `git checkout -b <your-branch-name>` to create a branch if you dont have one already. If you have created a branch already you can check it out to work on by using command `git checkout <your-branch-name>` in your terminal.
  
## Step 4 - Running the project
 
1) Navigate to the project directory and run `npm i` in your terminal if you havent already, to initialise the repositories and install all dependancies.
2) Therafter, run command `node app.js` to start the server
3) Access server by navigating to http://localhost:3000/


