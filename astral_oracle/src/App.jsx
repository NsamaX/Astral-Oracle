import { useState } from 'react';
import image_icon from './assets/card.png';
import icon_history from './assets/icon_history.png';
import icon_lightbul_on from './assets/icon_lightbul_on.png';
import HistorySidebar from './component/history';
import './css/App.css';

function App() {
  const [showHistory, setShowHistory] = useState(false); 
  const [userInput, setUserInput] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = async (numCards) => {
    setLoading(true);
    try {
      const response = await fetch(`https://tarotapi.dev/api/v1/cards/random?n=${numCards}`);
      const data = await response.json();
      const cardsWithOrientation = data.cards.map(card => {
        const isReversed = Math.random() > 0.5;
        return { ...card, isReversed };
      });
      console.log(cardsWithOrientation);
      setCards(cardsWithOrientation);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {cards.length > 0 && cards[0] ? (
            <img 
              className={`card-image ${cards[0].isReversed ? 'rev' : ''}`} 
              src={image_icon} 
              alt="card image" 
            />
          ) : (
            <img className='card-image' src={image_icon} alt="card image" />
          )}
          
          {cards.length === 0 && !loading && (
            <h3>Please pick a card.</h3>
          )}
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            cards.length > 0 && (
              <h3>{cards[0].name}</h3>
            )
          )}

          <div className='draw-cards'>
            {[1, 3, 5].map(num => (
              <button 
                key={num} 
                className='draw-button' 
                onClick={() => fetchCards(num)}
              >
                {num} Card{num > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </section>
        
        <section className='right-side'>
          {cards.length === 0 && !loading ? (
            <>
              <h2>Welcome to Astral Oracle</h2>
              <p>Discover cosmic insights and wisdom hidden within the stars. Astral Oracle is your gateway to daily tarot readings, offering profound guidance on love, career, and personal growth. Connect with the universe and unveil deeper meanings behind life events.</p>
              <p>Pick a card, or explore multi-card spreads to dive deeper into the mysteries shaping your path. Whether it's a single card or a five-card reading, we deliver personalized messages to illuminate your journey.</p>
              <p>Embrace the power of the tarot and let the stars guide you toward the answers you seek. Gain clarity, insight, and confidence to face the future.</p>
            </>
          ) : (
            cards.length > 0 && cards[0] && (
              <>
                <p><strong>Upright Meaning:</strong> {cards[0].isReversed ? cards[0].meaning_rev : cards[0].meaning_up}</p>
                <p><strong>Description:</strong> {cards[0].desc}</p>
              </>
            )
          )}
          
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
          { label: 'AI', source: 'Groq', link: 'https://groq.com/' },
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
