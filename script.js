const chatForm = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");

// ✅ 여기에 본인의 API 키를 입력하세요
const API_KEY = "AIzaSyCefNnwOACXbP-4sf8kS3UZJAD9UkzGQsA";

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // 줄바꿈 막기
    chatForm.dispatchEvent(new Event("submit")); // 폼 전송 이벤트 트리거
  }
});
  
chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = userInput.value.trim();
  if (input === "") return;

  addMessage("user", input);
  userInput.value = "";

  sendToGemini(input);
});

function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendToGemini(userText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const body = {
    system_instruction: {
      parts: [
        {
          text:
            "너는 치과의사고 답변은 간결하고" +
            "내가 아픈곳을 말하면 " +
            "인레이 : 1100Z010 , 온레이 : 1100Z020, 광중합형 복합레진 충전 : 1100Z030, 치석제거 : 1100Z040, 자가치아 이식술 : 1100Z050" +
            "잇몸웃음교정술 : 1100Z060, 임플란트 : 1180Z010, 크라운 : 1180Z020" +
            +"여기서 가장 근접해 보이는 비급여 코드 1개정도를 가져와서 알려줘",
        },
      ],
    },
    contents: [
      {
        parts: [
          {
            text: userText,
          },
        ],
      },
    ],
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Gemini 응답 파싱
    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "죄송합니다. 응답을 받을 수 없습니다.";
    addMessage("bot", botReply);
  } catch (error) {
    console.error("에러 발생:", error);
    addMessage("bot", "에러가 발생했습니다.");
  }
}
