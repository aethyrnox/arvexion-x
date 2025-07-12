function login() {
  const email = document.getElementById('email').value;
  const status = document.getElementById('status');

  if (!email) {
    status.textContent = "Please enter your email.";
    return;
  }

  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "main.html";
    } else {
      status.textContent = "Access denied. Email not registered.";
    }
  })
  .catch(err => {
    console.error(err);
    status.textContent = "Error connecting to server.";
  });
}
