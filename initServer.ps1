"creating virtual enviroment"
python -m venv .\backend\venv 
.\backend\venv\Scripts\activate 
"installing dependencies"
pip install --require-virtualenv -r ./backend/requirements.txt
"initializing database"
flask --app .\backend\server\ init-db
deactivate