const BACKEND_URL = (function() {
    if (window.location.protocol === 'file:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    return '';
})();

console.log('Backend URL:', BACKEND_URL);