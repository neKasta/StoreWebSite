const BACKEND_URL = (function() {
    if (window.location.protocol === 'file:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    return '';
})();

console.log('Backend URL:', BACKEND_URL);

document.addEventListener('DOMContentLoaded', function() {
    
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        
        registerForm.addEventListener('submit', async function(event) {
            
            event.preventDefault();
            
            await handleRegister();
        });
    } else {
        console.error('❌ Register form not found!');
    }
});


async function handleRegister() {
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const messageDiv = document.getElementById('message');
    const registerBtn = document.querySelector('.btn');

    if (!username || !email || !password || !confirmPassword) {
        showMessage('Заполните все поля', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Пароли не совпадают', 'error');
        return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]+$/;
    if (!passwordRegex.test(password)) {
        showMessage('Пароль должен содержать хотя бы одну: заглавную букву, строчную букву, цифру, специальный символ и не содержать пробелов', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Введите корректный email', 'error');
        return;
    }

    showMessage('Регистрируем...', 'loading');
    if (registerBtn) {
        registerBtn.disabled = true;
        registerBtn.textContent = 'Регистрация...';
    }

    try {
        
        const response = await fetch(`${BACKEND_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password 
            })
        });

        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message, 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Ошибка соединения с сервером', 'error');
    } finally {
        if (registerBtn) {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Зарегистрироваться';
        }
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}