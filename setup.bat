@echo off

REM navigate to the backend directory
cd backend

REM create a virtual environment named venv
python -m venv venv

REM activate the virtual environment
call venv\Scripts\activate

REM install the requirements
pip install -r requirements.txt

REM navigate to the frontend directory
cd ..\frontend

REM install the node modules
npm install

REM print a success message
echo Setup completed successfully.