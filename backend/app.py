import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_FOLDER = os.path.join(BASE_DIR, 'dist', 'public')

def create_app():
    app = Flask(__name__, static_folder=None)
    
    CORS(app)
    
    database_url = os.environ.get('DATABASE_URL')
    db_connected = False
    
    if database_url:
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
        }
        
        try:
            from .database import db
            db.init_app(app)
            
            with app.app_context():
                from . import models
                db.create_all()
            
            db_connected = True
            print("Database connected successfully!")
        except Exception as e:
            print(f"Database connection failed: {e}")
            print("Falling back to in-memory storage...")
            app.config.pop('SQLALCHEMY_DATABASE_URI', None)
    
    app.config['DB_CONNECTED'] = db_connected
    
    from .routes import api
    app.register_blueprint(api)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path and path.startswith('api'):
            return app.send_static_file('index.html')
        
        full_path = os.path.join(STATIC_FOLDER, path)
        if path and os.path.exists(full_path) and os.path.isfile(full_path):
            return send_from_directory(STATIC_FOLDER, path)
        
        return send_from_directory(STATIC_FOLDER, 'index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
