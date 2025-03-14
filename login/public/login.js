const loginForm = document.getElementById('login-btn');

loginForm.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Redirect to dashboard page
            window.location.href = '/dashboard.html';
        } else {
            alert('Login failed!');
        }
    } catch (err) {
        console.error(err);
    }
});
