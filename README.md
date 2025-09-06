<h1 align="center">Astral Oracle</h1>

## Overview

Welcome to Astral Oracle, a website that provides AI-powered tarot readings using external AI services to provide personalized predictions and using MongoDB to store your past tarot readings. Immerse yourself in the world of tarot and explore the insights it provides for your life's journey.

---

## Features

- **Tarot Card Reading:** Draw single or multiple cards to gain insights about your queries.
- **Interactive User Interface:** Click on the cards to shuffle and reveal their meanings.
- **AI Predictions:** Get personalized responses from an AI Tarot reader based on the cards drawn, powered by external AI.
- **History Tracking:** Save your past readings (questions and predictions) in a **MongoDB** database for future reference.
- **Cookie Consent Management:** Manage user cookie preferences for enhanced privacy.

---

## Usage

1. Select the number of cards you wish to draw (1, 3, or 5).
2. Enter your question in the provided input box.
3. Click on the cards to reveal their meanings and receive insights based on your question.

---

## Technologies

- **React:** Frontend framework for building the user interface.
- **Groq SDK:** For AI-powered tarot reading predictions.
- **Tarot API:** To fetch tarot card data and meanings.
- **MongoDB:** Database for storing user questions and AI predictions.
- **JavaScript:** Primary programming language used for development.
- **CSS:** For styling the application.

---

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/NsamaX/Astral-Oracle.git
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_GROQ_MODEL=llama3-8b-8192
   ```
   
   **Available Models:**
   - `llama3-8b-8192` (recommended)
   - `llama3-70b-8192`
   - `gemma-7b-it`
   - `gemma2-9b-it`

4. Start the application:
   ```bash
   npm run dev
   ```

Open your browser and visit [http://localhost:5173](http://localhost:5173).

---

## Environment

- `VITE_GROQ_API_KEY`: Your Groq API key for AI predictions
- `VITE_GROQ_MODEL`: The AI model to use for tarot readings (default: `llama-3.1-8b-instant`)

---

## Sources

- Image Source: [Daily Tarot Draw](https://www.dailytarotdraw.com/#gsc.tab=0)
- API Source: [Tarot API](https://tarotapi.dev/)
- AI Source: [Groq](https://groq.com/)

---

## License

This project is licensed under the **MIT License**.

---
