const API_URL = 'https://script.google.com/macros/s/AKfycbwRFAbB8kktjfmj5-nDXgzbeQ8s3tGCKujRZbORFCEJH80LpCJEad5ND2Glou_tv78HGA/exec'; // Ganti dengan Web App URL Apps Script kamu

// ================== LOGIN FUNCTION ==================
function login() {
  const email = document.getElementById('email').value;
  const status = document.getElementById('status');

  if (!email) {
    status.textContent = "Please enter your email.";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ mode: "login", email }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("userEmail", email);
        window.location.href = "main.html";
      } else {
        status.textContent = "Access denied. Email not registered.";
      }
    })
    .catch(err => {
      console.error(err);
      status.textContent = "Server error.";
    });
}

// ================== SEND MESSAGE FUNCTION ==================
function sendMessage() {
  const message = document.getElementById('message').value.trim();
  const fileInput = document.getElementById('fileUpload');
  const email = localStorage.getItem("userEmail");
  const chatBox = document.getElementById('chat-box');

  if (!email) {
    alert("Please log in again.");
    window.location.href = "index.html";
    return;
  }

  const formData = new FormData();
  formData.append("mode", "upload");
  formData.append("email", email);
  formData.append("message", message);

  if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  }

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        appendMessage(data.chat);
        document.getElementById('message').value = '';
        fileInput.value = '';
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to send.");
    });
}

// ================== APPEND CHAT TO UI ==================
function appendMessage(chat) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement("div");
  div.className = "chat-message";

  let content = `<strong>${chat.email}</strong>: ${chat.message}`;
  if (chat.fileUrl) {
    const isImage = /\.(png|jpg|jpeg|gif)$/i.test(chat.fileName);
    if (isImage) {
      content += `<br><img src="${chat.fileUrl}" style="max-width:200px;border-radius:8px;margin-top:5px;">`;
    } else {
      content += `<br><a href="${chat.fileUrl}" target="_blank">${chat.fileName}</a>`;
    }
  }

  div.innerHTML = content;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ================== LOAD CHAT HISTORY ==================
function loadChat() {
  const email = localStorage.getItem("userEmail");

  fetch(API_URL + `?mode=history`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.chats)) {
        data.chats.forEach(appendMessage);
      }
    })
    .catch(err => console.error("Failed to load history", err));
}

// Call loadChat when on main.html
if (window.location.pathname.includes("main.html")) {
  loadChat();
}
