from flask import Blueprint, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.stream_model import (
    get_all_streams, get_stream_by_id, stream_capacity_by_id)

stream_bp = Blueprint('streams', __name__)

@stream_bp.route('/streams', methods=['GET'])
def get_streams():
    try:
        streams = get_all_streams()
        return jsonify(streams), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@stream_bp.route('/streams/<int:stream_id>', methods=['GET'])
def get_stream(stream_id):
    try:
        stream = get_stream_by_id(stream_id)
        if stream:
            return jsonify(stream), 200
        else:
            return jsonify({'error': 'Stream not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@stream_bp.route('/streams/<int:stream_id>/capacity', methods=['GET'])
def get_stream_capacity(stream_id):
    try:
        capacity_info = stream_capacity_by_id(stream_id)
        if capacity_info:
            return jsonify(capacity_info), 200
        else:
            return jsonify({'error': 'Stream not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500