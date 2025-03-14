document.querySelector("button").addEventListener("click", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        document.getElementById("message").textContent = "Login successful! Redirecting...";
        setTimeout(() => window.location.href = "dashboard.html", 1000);
    } else {
        document.getElementById("message").textContent = data.message;
    }
});