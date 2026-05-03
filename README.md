# Astral Oracle

A tarot card reading web app that lets you draw cards and ask an AI fortune teller for personalized predictions.

## Screenshots

![Screenshot](astral-oracle.png)

## Features

- **Card Drawing**: Draw 1, 3, or 5 tarot cards at random, with upright or reversed orientation.
- **AI Predictions**: Ask a question and receive a mystical reading from an AI powered by Groq.
- **Reading History**: Past readings are saved locally via cookies for quick reference.
- **Bilingual Support**: Interface and AI responses support English and Thai.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/NsamaX/Astral-Oracle.git
   ```

2. **Prerequisites**
   - Node.js 18+
   - A [Groq](https://groq.com/) API key

3. **Set Up**
   Install dependencies:
   ```bash
   npm install
   ```
   Create a `.env` file in the root directory:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_GROQ_MODEL=llama-3.1-8b-instant
   ```
   Available models: `llama-3.1-8b-instant`, `llama-3.3-70b-versatile`

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## License

This project is licensed under the **MIT License**.
