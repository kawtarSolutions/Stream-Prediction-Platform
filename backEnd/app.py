from flask import Flask, jsonify
from flask_cors import CORS


# Import the blueprints (route groups) we created
from routes.student_routes import student_bp
from routes.stream_routes import stream_bp
from routes.preference_routes import preference_bp

# Import database connection to test it
from database.db_config import get_db_connection


# Create the Flask application
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
# This allows your React app (running on port 3000) 
# to communicate with Flask (running on port 5000)
CORS(app)

# Register Blueprints (Connect the routes)

# All student routes will start with /api/students
app.register_blueprint(student_bp, url_prefix='/api')

# All stream routes will start with /api/streams
app.register_blueprint(stream_bp, url_prefix='/api')

# All preference routes will start with /api/preferences
app.register_blueprint(preference_bp, url_prefix='/api')

# Root Route (Home Page)
@app.route('/')
def home():
    """
    Test route to verify the server is running
    Visit: http://localhost:5000/
    """
    return jsonify({
        'message': 'Welcome to Student Orientation API',
        'status': 'Server is running',
        'endpoints': {
            'students': '/api/students',
            'streams': '/api/streams',
            'preferences': '/api/preferences'
        }
    }), 200

#test database connection
@app.route('/api/health')
def health_check():
    """
    Test route to verify database connection
    Visit: http://localhost:5000/api/health
    """
    try:
        # Try to connect to the database
        conn = get_db_connection()
        conn.close()
        return jsonify({
            'status': 'healthy',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500

#Error handlers 
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors (page not found)"""
    return jsonify({
        'error': 'Endpoint not found',
        'status': 404
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors (server errors)"""
    return jsonify({
        'error': 'Internal server error',
        'status': 500
    }), 500


# Run the Application
if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Starting Student Orientation API Server")
    print("=" * 50)
    print("📍 Server running on: http://localhost:5000")
    print("📊 API endpoints available at: http://localhost:5000/api")
    print("🏥 Health check: http://localhost:5000/api/health")
    print("=" * 50)
    
    # Start the Flask development server
    app.run(
        debug=True,      # Shows detailed error messages (turn off in production)
        host='0.0.0.0',  # Makes server accessible from other devices
        port=5000        # Port number
    )