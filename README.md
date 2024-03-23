# Emojitar Maker

### DESCRIPTION

The emojitar prgram is an application for generating emojitars based on individual emojitar components, and displaying them in a preview box before saving them to a backend server. It also allows user to register and log in to the service.

The program can be ran on API port 23843 on St Andrews School of Computer Science servers. The server must be started before the program can be run, as emojitar components, user information and authorisation functionality is stored backend.

### RUNNING THE PROGRAM

Running and interacting with the web application also **requires Node.js and Express.js.** Having Node.js installed, the package manager NPM is used to install Express.js by running the command:
$ npm install express

Based on Node.js and the NPM packet manager, a user must **start the server from the terminal** before the application can return any useful outputs. Starting the server from the terminal can be done by running the command:
$ npm start

This command will trigger the execution of the package.json start script "nodemon backend.js", which has been implemented to restart the server on save for ease of developing the program.

### GIT

To download the latest version of the program, the following command can be run, replacing <USERNAME> with your St Andrews username, assuming you have acccess to the Computer Science servers.

git clone ssh://<USERNAME>@<USERNAME>.host.cs.st-andrews.ac.uk:/cs/group/cs5003-group-f/emojitar
