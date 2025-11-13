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
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        
        loginForm.addEventListener('submit', async function(event) {
            
            event.preventDefault();
            
            await handleLogin();
        });
    } else {
        console.error('❌ Login form not found!');
    }
});

async function handleLogin() { 
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('message');
    const loginBtn = document.querySelector('.btn');


    if (!username || !password) {
        messageDiv.textContent = 'Заполните все поля';
        messageDiv.className = 'message error';
        return;
    }


    messageDiv.textContent = '';
    messageDiv.className = 'message';


    messageDiv.textContent = 'Проверяем данные...';
    messageDiv.className = 'message loading';
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Вход...';
    }

    try {
        

        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password 
            })
        });

        

        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message success';


            setTimeout(() => {
                window.location.href = '/registration.html'; 
            }, 1000);
        } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message error'; 
        }
    } catch (error) {

        messageDiv.textContent = 'Ошибка соединения с сервером';
        messageDiv.className = 'message error';
    } finally {

        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    }
}
