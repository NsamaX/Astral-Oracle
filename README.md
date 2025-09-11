## Overview

This website is designed to play tarot cards and can ask questions of interest to AI to predict personal fortunes. The AI ​​used is from Groq, by sending questions and receiving answers with API. Statistics are kept using MongoDB to store questions of interest to users and answers to those questions.

## Features

- **Tarot Card Reading:** Draw single or multiple cards to gain insights about your queries.
- **Interactive User Interface:** Click on the cards to shuffle and reveal their meanings.
- **AI Predictions:** Get personalized responses from an AI Tarot reader based on the cards drawn, powered by external AI.
- **History Tracking:** Save your past readings (questions and predictions) in a **MongoDB** database for future reference.
- **Cookie Consent Management:** Manage user cookie preferences for enhanced privacy.

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

## Sources

- Images: [Daily Tarot Draw](https://www.dailytarotdraw.com/#gsc.tab=0)
- API: [Tarot API](https://tarotapi.dev/)

## License

This project is licensed under the **MIT License**.