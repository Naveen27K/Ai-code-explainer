# 🧠 AI Code Explainer

An AI-powered web application that helps beginners understand code in plain English. Paste any code snippet, select the language, and receive a structured explanation — including a line-by-line breakdown, time & space complexity, suggestions, and difficulty rating.

![App Screenshot](https://github.com/Naveen27K/Ai-code-explainer/blob/8b0b1b13b26bfc71d7e6e9eb0d5ccac887a3f66b/Screenshot%202026-07-01%20113545.png?raw=true)

---

## 🚀 Live Demo

> Coming soon / [Deploy your own](#deployment)

---

## 💡 Problem It Solves

Many students can copy code but struggle to understand:

- What the code is actually doing
- Why it works the way it does
- The algorithm behind it
- Its time and space complexity
- How to improve it

**AI Code Explainer** acts like a personal programming tutor — giving clear, structured explanations instantly.

---

## ✨ Features

- 🌐 **Language Selection** — Python, JavaScript, Java, C, C++, HTML, CSS, SQL
- 📝 **Code Editor** — Large input area for pasting code snippets
- ⚡ **Instant Explanation** — AI-generated response via OpenRouter API
- 📋 **Structured Output:**
  - Summary
  - Line-by-Line Explanation
  - Time Complexity
  - Space Complexity
  - Suggestions
  - Difficulty (🟢 Beginner / 🟡 Intermediate / 🔴 Advanced)
- ⏳ **Loading State** — Animated indicator while the AI processes
- ❌ **Error Handling** — Graceful messages for empty input or API failures

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React + Vite + Tailwind CSS |
| Backend   | Node.js / Express       |
| AI API    | OpenRouter (DeepSeek R1 — free tier) |
| Deployment | Vercel                 |

---

## 📁 Folder Structure

```
ai-code-explainer/
│
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── CodeEditor/
│   │   ├── LanguageDropdown/
│   │   ├── Loading/
│   │   └── ResponseCard/
│   │
│   ├── services/
│   │   └── openrouter.js
│   │
│   ├── pages/
│   │   └── Home/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   └── index.js          # Express backend / serverless function
│
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- An [OpenRouter](https://openrouter.ai/) API key (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen27K/Ai-code-explainer.git
cd Ai-code-explainer
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> ⚠️ **Never commit your API key.** The `.env` file is listed in `.gitignore`.

### 4. Run the App

```bash
# Start the backend (from /server)
node index.js

# Start the frontend (from root)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 How It Works

```
User pastes code + selects language
        │
        ▼
React builds a structured prompt
        │
        ▼
Frontend sends request to Express backend
        │
        ▼
Backend adds API key and calls OpenRouter
        │
        ▼
OpenRouter forwards to AI model (DeepSeek R1)
        │
        ▼
AI returns structured explanation
        │
        ▼
Frontend renders it in clean section cards
```

### Example API Request (Backend → OpenRouter)

```json
{
  "model": "deepseek/deepseek-r1:free",
  "messages": [
    {
      "role": "user",
      "content": "Explain this Python code. Return sections: Summary, Line-by-Line Explanation, Time Complexity, Space Complexity, Suggestions, Difficulty.\n\nCode:\nnums = [2,4,6]\nprint(max(nums))"
    }
  ]
}
```

---

## 🔒 Security Note

The OpenRouter API key is **never exposed in frontend code**. All API calls go through the Express backend, which keeps the key secure in server-side environment variables.

```
React Frontend  →  Express Backend  →  OpenRouter API
                        ↑
                   (API key lives here only)
```

---

## 🗺️ Roadmap

- [x] Language selection dropdown
- [x] Code input editor
- [x] AI explanation with structured sections
- [x] Loading and error states
- [ ] 🌙 Dark / Light mode toggle
- [ ] 📋 Copy explanation to clipboard
- [ ] 📄 Download explanation as PDF
- [ ] 🐞 Bug finder mode
- [ ] ⚡ Code optimizer mode
- [ ] 🔄 Convert code to another language
- [ ] 🧪 Generate test cases
- [ ] 💬 Follow-up chat about the code

---

## 🧩 Skills Demonstrated

- React component architecture
- State management with hooks
- REST API integration (OpenRouter)
- Async/await and error handling
- Prompt engineering
- Secure backend API key management
- Responsive UI with Tailwind CSS

---

## 📄 License

[MIT](LICENSE)

---

## 🙌 Author

**Naveen27K** — [GitHub](https://github.com/Naveen27K)

> ⭐ If you found this project helpful, consider giving it a star!
