const chatBox = document.getElementById("chat-box");

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("You", message);
  userInput.value = "";

  // Simple hardcoded response for now
  setTimeout(() => {
    let response = handleUserInput(message.toLowerCase());
    appendMessage("HopeBot", response);
  }, 500);
}

function handleUserInput(message) {
  if (message.includes("help")) {
    return "I can help you find housing, create a resume, prepare for job interviews, or talk about how you’re feeling. What do you need help with?";
  } else if (message.includes("housing")) {
    return "To find housing, tell me your city or zip code and I’ll look up affordable options near you.";
  } else if (message.includes("resume")) {
    return "Let’s build your resume together. What job have you done before or what skills do you have?";
  } else if (message.includes("mental") || message.includes("depressed")) {
    return "I'm here to talk. You're not alone. Would you like to vent or hear some calming advice?";
  } else {
    return "I'm still learning. Try typing 'help' to see what I can do!";
  }
}
