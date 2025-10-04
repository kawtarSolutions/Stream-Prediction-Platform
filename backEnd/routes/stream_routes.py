from flask import Blueprint, jsonify

# Create a Blueprint for stream-related routes
stream_bp = Blueprint('streams', __name__)

# Route 1: Get ALL streams
@stream_bp.route('/streams', methods=['GET'])
def get_streams():
    """
    What this does:
    - URL: GET /api/streams
    - Returns list of all streams (2AP, GC, GI, etc.)
    - React will use this to populate dropdown menus
    """
    return jsonify({'message': 'Get all streams'}), 200


# Route 2: Get ONE stream by ID
@stream_bp.route('/streams/<int:stream_id>', methods=['GET'])
def get_stream(stream_id):
    """
    What this does:
    - URL: GET /api/streams/3
    - Returns details about stream with id=3
    - Example: {"id": 3, "name": "GC", "capacity": 60}
    """
    return jsonify({'message': f'Get stream {stream_id}'}), 200