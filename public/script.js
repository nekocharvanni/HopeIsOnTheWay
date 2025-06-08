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

  // Get the AI response
  handleUserInput(message).then((botReply) => {
    appendMessage("HopeBot", botReply);
  });
}

async function handleUserInput(message) {
  try {
    const response = await fetch("https://hope-is-on-the-way.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply || "Sorry, something went wrong.";
  } catch (err) {
    console.error("API call failed:", err);
    return "Oops! I had trouble connecting. Please try again soon.";
  }
}

}
