import { useState } from 'react';
import image_icon from './assets/card.png';
import icon_history from './assets/icon_history.png';
import icon_lightbul_on from './assets/icon_lightbul_on.png';
import HistorySidebar from './component/history';
import './css/App.css';

function App() {
  const [showHistory, setShowHistory] = useState(false); 
  const [userInput, setUserInput] = useState('');

  return (
    <>
      <header className='header'>
        <h1>Astral Oracle</h1>
        <div className='icon-history' onClick={() => setShowHistory(prev => !prev)}>
          <img src={icon_history} alt="History Icon" />
        </div>
      </header>
      <HistorySidebar showHistory={showHistory} onClose={() => setShowHistory(false)} />
      {showHistory && <div className="overlay" onClick={() => setShowHistory(false)} />}

      <main className='body'>
        <section className='left-side'>
          <img className='card-image' src={image_icon} alt="card image" />
          <h3>Please pick up the card.</h3>
          <div className='draw-cards'>
            {[1, 3, 5].map(num => (
              <button key={num} className='draw-button'>{num} Card{num > 1 ? 's' : ''}</button>
            ))}
          </div>
        </section>
        
        <section className='right-side'>
          <h2>Welcome to Astral Oracle</h2>
          <p>Discover cosmic insights and wisdom hidden within the stars. Astral Oracle is your gateway to daily tarot readings, offering profound guidance on love, career, and personal growth. Connect with the universe and unveil deeper meanings behind life events.</p>
          <p>Pick a card, or explore multi-card spreads to dive deeper into the mysteries shaping your path. Whether it's a single card or a five-card reading, we deliver personalized messages to illuminate your journey.</p>
          <p>Embrace the power of the tarot and let the stars guide you toward the answers you seek. Gain clarity, insight, and confidence to face the future.</p>

          <div className='input-container'>
            <input
              className='ask-the-oracle'
              type='text'
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder='Type your question here...'
            />
            <div className='icon-lightbul-on' onClick={() => { console.log("User input:", userInput); setUserInput(''); }}>
              <img src={icon_lightbul_on} alt="Ask" />
            </div>
          </div>
        </section>
      </main>

      <footer className='footer'>
        <div className='source'>
        {[
          { label: 'Image', source: 'Daily Tarot Draw', link: 'https://www.dailytarotdraw.com/#gsc.tab=0' },
          { label: 'API', source: 'Tarot API', link: 'https://tarotapi.dev/' },
          { label: 'AI', source: 'Groq AI', link: 'https://groq.com/' },
        ].map(({ label, source, link }) => (
          <div className='source-item' key={label}>
            <p>{label}</p>
            <a href={link}>{source}</a>
          </div>
        ))}
        </div>
      </footer>
    </>
  );
}

export default App;
