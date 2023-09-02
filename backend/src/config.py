class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///projectpilot.db'
    SECRET_KEY = 'some secret string'
    CORS_OPTIONS = {"origins": ["http://localhost:3000"]}