#!/bin/bash

echo "Please select an option:"
echo "1. Setup"
echo "2. Start Servers"

read -p "Enter the number of your choice: " choice

case $choice in
  1)
    echo "Running Setup..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ../frontend
    npm install
    echo "Setup completed successfully."
    ;;
  2)
    echo "Starting Servers..."
    cd backend
    source venv/bin/activate
    export FLASK_APP=src/app.py
    export FLASK_ENV=development
    flask run &
    cd ../frontend
    npm start
    echo "Servers started successfully."
    ;;
  *)
    echo "Invalid choice, exiting."
    exit 1
    ;;
esac
