const BACKEND_URL = (function() {
    if (window.location.protocol === 'file:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    return '';
})();

console.log('Backend URL:', BACKEND_URL);

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await handleLogin();
        });
    }
});

// Функция для обработки входа
async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('message');
    const loginBtn = document.querySelector('.btn');
    
    if (!username || !password) {
        showMessage('Заполните все поля', 'error');
        return;
    }
    
    showMessage('Проверяем данные...', 'loading');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Вход...';
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Успешный вход!', 'success');
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Ошибка соединения с сервером', 'error');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}

// Функция для тестирования бэкенда
async function testBackend() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/test`);
        const data = await response.json();
        alert(`✅ Бэкенд работает!\nСообщение: ${data.message}`);
    } catch (error) {
        alert('❌ Не удалось подключиться к бэкенду');
    }
}

// Функция для показа сообщений
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
}