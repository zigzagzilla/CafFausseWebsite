import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from .models import db
from .routes import api

load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='../dist/public', static_url_path='')
    
    CORS(app)
    
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        raise ValueError("DATABASE_URL environment variable is required")
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    app.register_blueprint(api)
    
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
