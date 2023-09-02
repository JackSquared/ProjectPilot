@echo off

REM navigate to the backend directory
cd backend

REM activate the virtual environment
call venv\Scripts\activate

REM set the FLASK_APP environment variable
set FLASK_APP=src\app.py
set FLASK_ENV=development

REM start the backend server
start cmd /k flask run

REM navigate to the frontend directory
cd ..\frontend

REM start the frontend server
start cmd /k npm start

REM print a success message
echo Servers started successfully.