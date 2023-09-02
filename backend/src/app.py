from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from .db import db, init_db
from .models.User import User
from .config import Config
from .auth import auth
from .main import main

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": app.config['CORS_OPTIONS']})

    db.init_app(app)
    with app.app_context():
        db.create_all()

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "login"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    app.register_blueprint(auth)
    app.register_blueprint(main)

    return app