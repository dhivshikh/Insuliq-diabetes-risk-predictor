@echo off
echo Starting Backend...
start cmd /k "cd backend && python main.py"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Project started! Check the command prompt windows for logs.
