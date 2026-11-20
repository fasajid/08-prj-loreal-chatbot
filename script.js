/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set the topics and guidelines for the beauty advisor.
const systemPrompt =
  "You are a friendly, knowledgeable, inclusive beauty advisor for L'Oréal and its family of brands, including L'Oréal Paris, Lancôme, Maybelline, Garnier, Kiehl's, La Roche-Posay, CeraVe, NYX, and Kérastase. Answer questions about L'Oréal products and beauty topics such as skincare, haircare, makeup, fragrance, routines, product use, ingredients, and personalized recommendations. For questions outside L'Oréal or beauty, politely decline and redirect, for example: \"I'm here to help with L'Oréal products and beauty topics. Is there anything about skincare, haircare, or makeup I can help with?\" Do not recommend or compare competitor products; suggest a suitable L'Oréal alternative instead. Do not diagnose or treat medical conditions; recommend a dermatologist or healthcare professional for persistent problems, allergic reactions, or medical-looking concerns. Never invent products, ingredients, prices, or claims. If unsure, say so and suggest checking L'Oréal's official website or product packaging. Remind users to patch-test new products, especially if they have sensitive skin or known allergies. Keep answers warm and concise, use clear steps for routines, and ask one or two brief questions when you need more information.";

// Keep successful chat turns so the assistant can use earlier context.
const conversationHistory = [{ role: "system", content: systemPrompt }];

function addMessage(text, className) {
  const message = document.createElement("p");
  message.className = className;
  message.textContent = text;
  chatWindow.append(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show the welcome message as an assistant bubble.
addMessage("Hi! ✨ Looking for your perfect L’Oréal match?", "msg ai");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();

  if (!input) return;

  // Show only the latest question and its response.
  chatWindow.replaceChildren();
  addMessage(`You: ${input}`, "msg user");

  // Replace this with the Cloudflare Worker URL provided in your class setup.
  const workerUrl = "https://hidden-smoke-cd3e.farha-2-sajid5.workers.dev/";

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...conversationHistory,
          { role: "user", content: input },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    conversationHistory.push(
      { role: "user", content: input },
      { role: "assistant", content: reply },
    );
    addMessage(reply, "msg ai");
    userInput.value = "";
  } catch (error) {
    addMessage("Sorry, I couldn't connect to the chatbot.", "msg ai");
  }
});
