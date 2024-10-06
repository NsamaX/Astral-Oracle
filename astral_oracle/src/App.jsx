import React, { useEffect, useState } from 'react';
import Groq from 'groq-sdk';
import cardData from './card_data.json';
import image_icon from './assets/card.png';
import icon_history from './assets/icon_history.png';
import icon_lightbul_on from './assets/icon_lightbul_on.png';
import Cookies from 'js-cookie';
import CookieConsent from './component/cookie';
import HistorySidebar from './component/history';
import './css/App.css';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

function App() {
  const [cards, setCards] = useState([]);
  const [prevCards, setPrevCards] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [groqResponse, setGroqResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [dots, setDots] = useState('');

  useEffect(() => {
    setShowCookieConsent(true); 
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 800);
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (groqResponse) {
      setDisplayedResponse('');
      let index = 0;

      const interval = setInterval(() => {
        if (index < groqResponse.length) {
          setDisplayedResponse(prev => prev + groqResponse[index]);
          index++;
        } else {
          clearInterval(interval); 
        }
      }, 30);
    }
  }, [groqResponse]);

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };
  
  const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  };  

  const handleCookieDecline = () => {
    setShowCookieConsent(false);
    Cookies.remove('cardHistory');
    Cookies.remove('cookieConsent');
  };  

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
    setCookie('cookieConsent', 'true', 365);
  };

  const saveCardToHistory = (cardData) => {
    const consent = getCookie('cookieConsent');
    if (consent === 'true') {
      let history = JSON.parse(getCookie('cardHistory') || '[]');
      history.unshift({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        card: cardData.name,
        image: cardData.image,
        orientation: cardData.isReversed ? 'Reversed' : 'Normal',
      });
      setCookie('cardHistory', JSON.stringify(history), 365);
    }
  };  
  
  const fetchCards = async (numCards) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const response = await fetch(`https://tarotapi.dev/api/v1/cards/random?n=${numCards}`);
      const data = await response.json();
      const cardsWithOrientation = data.cards.map((card, index) => {
        const image = getCardImage(card.name_short);
        const isReversed = Math.random() > 0.5;
        const randomRotation = index > 0 ? Math.floor(Math.random() * 20) - 5 : 0;
        return { ...card, image, isReversed, rotation: randomRotation };
      });
  
      setCards(cardsWithOrientation);
      setPrevCards([cardsWithOrientation[0]]);
      console.log(cardsWithOrientation);
  
      cardsWithOrientation.forEach(card => {
        saveCardToHistory(card);
      });
  
      setGroqResponse('');
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };  

  const getCardImage = (nameShort) => {
    const cardInfo = cardData.cards.find(card => card.name_short === nameShort); 
    return cardInfo ? cardInfo.image : image_icon; 
  };

  const handleCardClick = () => {
    setCards(prevCards => {
      if (prevCards.length > 0) {
        const firstCard = prevCards[0];
        const newCards = prevCards.slice(1); 
        setPrevCards(newCards);
        return [...newCards, firstCard];
      }
      return prevCards;
    });
  };

  const fetchGroqAI = async () => {
    if (!userInput || cards.length === 0) return; 
    setLoading(true);
  
    const drawnCards = cards.map(card => `${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})`).join(', ');
  
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a Tarot reader providing concise and insightful predictions based on Tarot cards. Respond directly to the user's question without unnecessary introductions or disclaimers. Answer in English.",
          },
          {
            role: "user",
            content: `I have drawn the following cards: ${drawnCards}. My question is: ${userInput}`,
          },
        ],
        model: "mixtral-8x7b-32768",
      });
  
      const rawResponse = completion.choices[0]?.message?.content || "";
      const filteredResponse = rawResponse.split('\n').filter(line => line.trim() !== '').join(' ');
  
      setGroqResponse(filteredResponse);
    } catch (error) {
      console.error('Error fetching from Groq AI:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <header className='header'>
        <h1 translate='no'>Astral Oracle</h1>
        <div className='icon-history' onClick={() => setShowHistory(prev => !prev)}>
          <img src={icon_history} alt="History Icon" />
        </div>
      </header>
      <HistorySidebar showHistory={showHistory} onClose={() => setShowHistory(false)} />
      {showHistory && <div className="overlay" onClick={() => setShowHistory(false)} />}

      <main className='body'>
        <section className='left-side'>
          <div className="card-container">
          {cards.length > 0 ? (
            cards.map((card, index) => {
              const displayCardIndex = (index + 1) % cards.length; 
              const displayCard = cards[displayCardIndex];
              
              return (
                <img 
                  key={index}
                  className={`card-image ${index > 0 ? 'stacked' : ''}`} 
                  src={displayCard.image} 
                  alt={displayCard.name} 
                  style={{ 
                    transform: `rotate(${displayCard.rotation}deg) scale(${displayCard.isReversed ? -1 : 1})`,
                  }}
                  onClick={handleCardClick}
                />
              );
            })
          ) : (
            <img className='card-image' src={image_icon} alt="card image" />
          )}

          </div>
          
          {cards.length === 0 && !loading && (
            <h3>Please pick a card.</h3>
          )}
          {loading ? (
            <h3>Shuffling cards{dots}</h3>
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
          
          {cards.length > 0 && (
            <div className='input-container'>
              <input
                className='ask-the-oracle'
                type='text'
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="What is on your mind, dear seeker?"
                style={{ paddingRight: userInput ? '46px' : '0' }}
              />
              {userInput && (
                <div className='icon-lightbul-on' onClick={() => { 
                    fetchGroqAI();
                    setUserInput(''); 
                }}>
                  <img src={icon_lightbul_on} alt="Ask" />
                </div>
              )}
            </div>
          )}
          
          <div className='oracle-answer'>
            {loading && 
              <p>
                🌌 The oracle weaves destiny's threads, connecting with cosmic energies... 🌠 
                Prepare for celestial guidance from the stars! 
              </p>
            }
            {displayedResponse && <p>{displayedResponse}</p>}
          </div>
        </section>
        
        <section className='right-side'>
          {cards.length === 0 && !loading ? (
            <>
              {showCookieConsent && (
                <>
                  {(getCookie('cookieConsent') === 'true') ? (
                    <h2>🌟Welcome back!🌟</h2>
                  ) : (
                    <h2>✨Greetings Traveler!✨</h2>
                  )}
                  <CookieConsent 
                    hasCookie={getCookie('cookieConsent') === 'true'}
                    onAccept={handleCookieAccept} 
                    onDecline={handleCookieDecline} 
                  />
                </>
              )}
              
              <p>
                ✨ Step into the celestial realm where cosmic insights and ancient wisdom await! 
                The Astral Oracle serves as your mystical gateway to daily tarot readings, 
                weaving profound tales of love, destiny, and personal growth amidst the stardust. 
                🌌 Connect with the universe and unveil the deeper meanings hidden in the tapestry of life events.
              </p>
              <p>
                🌠 Choose a card, or embark on a journey through multi-card spreads to delve into the mysteries 
                shaping your cosmic path. Whether you seek clarity from a single card or the wisdom of a five-card spread, 
                we offer personalized messages to illuminate your sacred journey. 
              </p>
              <p>
                Embrace the enchanting power of the tarot, and let the stars guide you to the answers you seek. 
                🌟 Gain clarity, insight, and the courage to face the unfolding chapters of your destiny! 
              </p>
            </>
          ) : (
            cards.length > 0 && (
              cards.map((card, index) => (
                <div key={index}>
                  {prevCards.length > 0 && prevCards[0].name === card.name ? (
                      <h1 className='choosen-card'>
                        {card.name}
                      </h1>
                    ) : <p>{card.name}</p>
                  }
                  <p>
                    {card.isReversed ? 'Reversed' : 'Upright'} Meaning:  
                    {card.isReversed ? card.meaning_rev : card.meaning_up}
                  </p>
                  <p>Description: {card.desc}</p>
                </div>
              ))
            )
          )}
        </section>
      </main>

      <footer className='footer'>
        <div className='source'>
          {[
            { label: 'Image', source: 'Daily Tarot Draw', link: 'https://www.dailytarotdraw.com/#gsc.tab=0' },
            { label: 'API', source: 'Tarot API', link: 'https://tarotapi.dev/' },
            { label: 'AI', source: 'Groq', link: 'https://groq.com/' },
            { label: 'Github', source: 'NsamaX', link: 'https://github.com/NsamaX/Astral-Oracle' },
          ].map(({ label, source, link }) => (
            <div className='source-item' key={label}>
              <p>{label}</p>
              <a translate='no' href={link} target="_blank" rel="noopener noreferrer">{source}</a>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}

export default App;
