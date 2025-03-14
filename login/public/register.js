// Add JS to handle form submission via fetch if needed
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Send the data to the server via fetch
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, confirmPassword })
    });

    const data = await response.json();

    if (response.ok) {
        alert('Account created successfully!');
        window.location.href = '/login.html'; // Redirect to login page
    } else {
        alert(data.message || 'Error occurred!');
    }
});