# HSP-Clinic-Server


## Setting-Up
### Prerequisits:
make sure to download the following

1) git (https://github.com/git-guides/install-git)
2) node.js (https://nodejs.org/)
3) Visual Studio Code (https://code.visualstudio.com/)
4) MySQL Community Download (use Developer Default option within setup - includes Workbench) (https://dev.mysql.com/downloads/installer/)

## Step 1 - Setting up the SQL Data Base

1) Create a SQL server on your local machine
2) Create a new schema and name it as you wish (e.g. hsp_group).
3) Set the created schema to be the default and then create the following tables by running the associated commands below.
4) Create addresses table: 
  <br/>`CREATE TABLE addresses (
  `<br/>`id int NOT NULL AUTO_INCREMENT,
  `<br/>`address_description longtext NOT NULL,
  `<br/>`PRIMARY KEY (id)
  `<br/>`) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
3) Create allergies table:
   <br/>`CREATE TABLE allergies (
  `<br/>`id int NOT NULL AUTO_INCREMENT,
  `<br/>`allergy_description longtext,
  `<br/>`PRIMARY KEY (id),
  `<br/>` UNIQUE KEY id_UNIQUE (id)
  `<br/>`) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
3) Create user_verifications table:
   <br/>`CREATE TABLE user_verifications (
  `<br/>`id bigint NOT NULL AUTO_INCREMENT,
  `<br/>`user_id bigint NOT NULL,
  `<br/>`unique_string varchar(80) NOT NULL,
  `<br/>`PRIMARY KEY (id),
  `<br/>`UNIQUE KEY user_id_UNIQUE (user_id),
  `<br/>`UNIQUE KEY unique_string_UNIQUE (unique_string)
  `<br/>`) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
4) create users table:
   <br/>`CREATE TABLE users ( 
  `<br/>`id bigint NOT NULL AUTO_INCREMENT,
  `<br/>`first_name varchar(45) NOT NULL,
  `<br/>`last_name varchar(45) NOT NULL,
  `<br/>`student_number varchar(13) NOT NULL,
  `<br/>`email varchar(50) NOT NULL,
  `<br/>`password varchar(80) NOT NULL,
  `<br/>`phone_number varchar(13) NOT NULL,
  `<br/>`allergies varchar(255) DEFAULT NULL,
  `<br/>`address varchar(255) DEFAULT NULL,
  `<br/>`gender char(1) DEFAULT NULL,
  `<br/>`DOB date DEFAULT NULL,
  `<br/>`validated int NOT NULL DEFAULT 0,
  `<br/>`PRIMARY KEY (id),
  `<br/>`UNIQUE KEY id (id),
  `<br/>`UNIQUE KEY email (email),
  `<br/>`UNIQUE KEY student_number (student_number)
  `<br/>`) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  4) create user_resets table:
  <br/>`CREATE TABLE user_resets (
  `<br/>`id bigint NOT NULL AUTO_INCREMENT,
  `<br/>`user_id bigint NOT NULL,
  `<br/>`unique_string varchar(80) NOT NULL,
  `<br/>`PRIMARY KEY (id),
  `<br/>`UNIQUE KEY unique_string_UNIQUE (unique_string)
  `<br/>`) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`




## Step 2 - Setting up the Environment variables (.env)

1) Create a new file in the project directory and name it `.env`
2) Type the following in the .env file:
  <br/>` DB_PASS=<value>`<br/>`
    DB_USER=<value>`<br/>`
    DB_PORT=<value>`<br/>`
    DB_HOST=<value>`<br/>`
    DB=<value>`<br/>`
    SENDGRID_API_KEY=<value>`<br/>`
    TOKEN_SECRET=<value>`<br/>`
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
4) Commit and Push your changes to your branch (NOT `main`)
5) Please get in contact with others' to peer review your additions before merging to main
6) Kindly contact me before merging to main :); All merge conflicts must be resolved!

  
## Step 4 - Running the project
 
1) Navigate to the project directory and run `npm i` in your terminal if you havent already, to initialise the repositories and install all dependancies.
2) Therafter, run command `node app.js` to start the server
3) Access server by navigating to http://localhost:3000/


