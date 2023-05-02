# World collection

Web single-page application for managing map objects.

## How to initialize

To init application you have to init backend and frontend separately.
This tutorial is for Windows users.

### Backend

#### Pre-requisities

You need to have installed :

- python and pip (pip should be included in python)
  Python : https://www.python.org/downloads/
  Pip : https://pip.pypa.io/en/stable/installation/
- Powershell

#### Initialize server

To initialize server:

- start Powershell terminal and go into root dir of this project
- run command : .\initServer.ps1

Thats all you have to do to.
This initialize virtual environment, install all dependencies and initialize database.

### Frontend

#### Pre-requisities

You need to have installed :

- Node.js and npm (npm should be included in Node.js)
  Node.js: https://nodejs.org/en/download
  npm :https://www.npmjs.com/package/npm
- Powershell

#### Initialize Frontend

To initialize fronted:

- start Powershell terminal and go into **world-collection-app** dir of this project
- run command : npm install (thats will install all dependendencies)

Thats all you have to do to.

## How to start application

To start application you need open two seperate PowerShell terminals.
One for backend and one for frontend.

#### Start backend

- start Powershell terminal and go into root dir of this project
- run command : .\startServer.ps1

#### Start backend

- start Powershell terminal and go into **world-collection-app** dir of this project

- run command : npm start

Then page should run on url : http://localhost:3000/

## Problems
If you are not allowed to open powershell scipts then:
- run command : 
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

Then it should allowed you to open scripts.