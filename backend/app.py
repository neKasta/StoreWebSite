from quart import Quart, jsonify, request, send_from_directory
from quart_cors import cors
import os

from core.auth import login_user
from core.reg import register_user, validate_registration_data

app = Quart(__name__)
app = cors(app, allow_origin="*")

FRONTEND_BASE = os.path.join(os.path.dirname(__file__), '../frontend')
FRONTEND_HTML = os.path.join(FRONTEND_BASE, 'html')
FRONTEND_CSS = os.path.join(FRONTEND_BASE, 'css')
FRONTEND_JS = os.path.join(FRONTEND_BASE, 'js')


@app.route('/')
async def serve_index():
    return await send_from_directory(FRONTEND_HTML, 'login.html')

@app.route('/css/<path:filename>')
async def serve_css(filename):
    return await send_from_directory(FRONTEND_CSS, filename)

@app.route('/js/<path:filename>')
async def serve_js(filename):
    return await send_from_directory(FRONTEND_JS, filename)

@app.route('/<path:page>')
async def serve_html(page):
    return await send_from_directory(FRONTEND_HTML, page)


@app.route('/api/login', methods=['POST'])
async def handle_login():
    try:
        data = await request.get_json()
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        
        if not username:
            return jsonify({
                "success": False, 
                "message": "Введите почту или имя пользователя"
            })
            
        if not password:
            return jsonify({
                "success": False, 
                "message": "Введите пароль"
            })
        
        success, message, user = await login_user(username, password)
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            })
        else:
            return jsonify({
                "success": False, 
                "message": message
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        })

@app.route('/api/register', methods=['POST'])
async def handle_register():
    try:

        data = await request.get_json()
        

        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        

        if not username:
            return jsonify({
                "success": False, 
                "message": "Введите имя пользователя"
            })
            
        if not email:
            return jsonify({
                "success": False, 
                "message": "Введите email"
            })
            
        if not password:
            return jsonify({
                "success": False, 
                "message": "Введите пароль"
            })
        

        validation_errors = validate_registration_data(username, email, password)
        if validation_errors:
            return jsonify({
                "success": False,
                "message": ", ".join(validation_errors)
            })
        

        success, message, user = await register_user(username, email, password)
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            })
        else:
            return jsonify({
                "success": False, 
                "message": message
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Ошибка сервера при регистрации: {str(e)}"
        })


@app.route('/api/register', methods=['OPTIONS'])
async def handle_register_options():
    return '', 200

@app.route('/api/login', methods=['OPTIONS'])
async def handle_login_options():
    return '', 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')