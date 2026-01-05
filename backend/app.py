import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from .database import db

load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='../dist/public', static_url_path='')
    
    CORS(app)
    
    pghost = os.environ.get('PGHOST')
    pguser = os.environ.get('PGUSER')
    pgpassword = os.environ.get('PGPASSWORD')
    pgdatabase = os.environ.get('PGDATABASE')
    pgport = os.environ.get('PGPORT', '5432')
    
    if pghost and pguser and pgpassword and pgdatabase:
        from urllib.parse import quote_plus
        database_url = f"postgresql://{pguser}:{quote_plus(pgpassword)}@{pghost}:{pgport}/{pgdatabase}?sslmode=require"
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        database_url = os.environ.get('DATABASE_URL')
        if database_url:
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        else:
            raise ValueError("Database connection variables are required")
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    db.init_app(app)
    
    from .routes import api
    from . import models
    app.register_blueprint(api)
    
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def serve_frontend():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:path>')
    def serve_static(path):
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
