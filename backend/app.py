from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Пути к разным папкам фронтенда
FRONTEND_BASE = os.path.join(os.path.dirname(__file__), '../frontend')
FRONTEND_HTML = os.path.join(FRONTEND_BASE, 'html')
FRONTEND_CSS = os.path.join(FRONTEND_BASE, 'css')
FRONTEND_JS = os.path.join(FRONTEND_BASE, 'js')

@app.route('/')
def server_index():
    return send_from_directory(FRONTEND_HTML, 'login.html')

# Маршруты для CSS файлов
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(FRONTEND_CSS, filename)

# Маршруты для JS файлов  
@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(FRONTEND_JS, filename)

# Маршруты для HTML файлов
@app.route('/<path:page>')
def serve_html(page):
    return send_from_directory(FRONTEND_HTML, page)

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"status": "success", "message": "Backend работает!"})

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if username and password:
            return jsonify({
                "success": True,
                "message": f"Добро пожаловать, {username}!",
                "user": username
            })
        else:
            return jsonify({
                "success": False,
                "message": "Заполните все поля"
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Ошибка сервера: {str(e)}"
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)