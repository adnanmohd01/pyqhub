document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------------------
    // Scroll-down Reveal Animation
    // ---------------------------------------------------------
    const elements = document.querySelectorAll(".scroll-down");

    if (elements.length > 0) {
        const handleScroll = () => {
            elements.forEach((element) => {
                const position = element.getBoundingClientRect().top;
                if (position < window.innerHeight - 100) {
                    element.classList.add("show");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
    }

    // ---------------------------------------------------------
    // Floating Chat Screen & Button
    // ---------------------------------------------------------
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const chatCloseBtn = document.getElementById("chatCloseBtn");
    const chatWindow = document.getElementById("chatWindow");
    const chatIcon = document.getElementById("chatIcon");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatBody = document.getElementById("chatBody");
    const typingIndicator = document.getElementById("chatTypingIndicator");
    const chatSendBtn = document.getElementById("chatSendBtn");

    if (chatToggleBtn && chatWindow) {
        const toggleChat = (forceState) => {
            const isOpen = forceState !== undefined ? forceState : !chatWindow.classList.contains("open");
            if (isOpen) {
                chatWindow.classList.add("open");
                if (chatIcon) chatIcon.textContent = "✕";
                chatToggleBtn.setAttribute("aria-expanded", "true");
                setTimeout(() => chatInput && chatInput.focus(), 300);
            } else {
                chatWindow.classList.remove("open");
                if (chatIcon) chatIcon.textContent = "💬";
                chatToggleBtn.setAttribute("aria-expanded", "false");
            }
        };

        chatToggleBtn.addEventListener("click", () => toggleChat());
        if (chatCloseBtn) {
            chatCloseBtn.addEventListener("click", () => toggleChat(false));
        }

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && chatWindow.classList.contains("open")) {
                toggleChat(false);
            }
        });

        // Format current time
        const getCurrentTime = () => {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        };

        // Scroll chat to bottom
        const scrollToBottom = () => {
            if (chatBody) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        };

        // Append user message immediately
        const appendUserMessage = (text) => {
            const msgDiv = document.createElement("div");
            msgDiv.className = "chat-msg user";

            const bubble = document.createElement("div");
            bubble.className = "msg-bubble";
            bubble.textContent = text;

            const time = document.createElement("span");
            time.className = "msg-time";
            time.textContent = getCurrentTime();

            msgDiv.appendChild(bubble);
            msgDiv.appendChild(time);

            if (typingIndicator) {
                chatBody.insertBefore(msgDiv, typingIndicator);
            } else {
                chatBody.appendChild(msgDiv);
            }

            scrollToBottom();
        };

        // Tokenize HTML so tags (<a>, <strong>, <br>) aren't broken mid-stream
        const tokenizeHtml = (html) => {
            const tokens = [];
            let i = 0;
            while (i < html.length) {
                if (html[i] === "<") {
                    const closeIdx = html.indexOf(">", i);
                    if (closeIdx !== -1) {
                        tokens.push(html.slice(i, closeIdx + 1));
                        i = closeIdx + 1;
                        continue;
                    }
                }
                tokens.push(html[i]);
                i++;
            }
            return tokens;
        };

        // Stream bot message with ChatGPT-style typewriter effect
        const streamBotMessage = (contentHtml) => {
            const msgDiv = document.createElement("div");
            msgDiv.className = "chat-msg bot";

            const bubble = document.createElement("div");
            bubble.className = "msg-bubble";
            bubble.innerHTML = `<span class="typing-cursor"></span>`;

            msgDiv.appendChild(bubble);

            if (typingIndicator) {
                chatBody.insertBefore(msgDiv, typingIndicator);
            } else {
                chatBody.appendChild(msgDiv);
            }
            scrollToBottom();

            const tokens = tokenizeHtml(contentHtml);
            let index = 0;
            let accumulatedHtml = "";

            // Disable input while typing
            if (chatInput) chatInput.disabled = true;
            if (chatSendBtn) chatSendBtn.disabled = true;

            const timer = setInterval(() => {
                if (index < tokens.length) {
                    accumulatedHtml += tokens[index];
                    index++;

                    // Fast-forward through immediate consecutive tags
                    while (index < tokens.length && tokens[index].startsWith("<")) {
                        accumulatedHtml += tokens[index];
                        index++;
                    }

                    bubble.innerHTML = accumulatedHtml + `<span class="typing-cursor"></span>`;
                    scrollToBottom();
                } else {
                    clearInterval(timer);
                    // Remove cursor
                    bubble.innerHTML = accumulatedHtml;

                    const time = document.createElement("span");
                    time.className = "msg-time";
                    time.textContent = getCurrentTime();
                    msgDiv.appendChild(time);

                    scrollToBottom();

                    // Re-enable input
                    if (chatInput) {
                        chatInput.disabled = false;
                        chatInput.focus();
                    }
                    if (chatSendBtn) chatSendBtn.disabled = false;
                }
            }, 18);
        };

        // Send message handler
        const sendMessage = async () => {
            const message = (chatInput ? chatInput.value : "").trim();
            if (!message) return;

            // Display user message
            appendUserMessage(message);
            if (chatInput) chatInput.value = "";

            // Show typing indicator briefly while fetching response
            if (typingIndicator) {
                typingIndicator.classList.add("show");
                scrollToBottom();
            }

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: message })
                });

                if (typingIndicator) typingIndicator.classList.remove("show");

                if (res.ok) {
                    const data = await res.json();
                    streamBotMessage(data.response || "I received your message!");
                } else {
                    streamBotMessage("Sorry, I encountered an issue connecting to the assistant. Please try again or visit our <a href='/contact'>Contact page</a>.");
                }
            } catch (err) {
                if (typingIndicator) typingIndicator.classList.remove("show");
                streamBotMessage("Network error. Please make sure the server is running or check your connection.");
            }
        };

        // Form submit
        if (chatForm) {
            chatForm.addEventListener("submit", (e) => {
                e.preventDefault();
                sendMessage();
            });
        }
    }
});
