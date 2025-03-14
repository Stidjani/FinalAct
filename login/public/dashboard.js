const token = localStorage.getItem('token');

if (token) {
    // Decode the JWT payload to extract the username
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.username;

    // Display the username on the dashboard
    document.getElementById('welcome-message').innerText = `Welcome, ${username}`;
} else {
    // If no token, redirect to login page
    window.location.href = 'login.html';
}
