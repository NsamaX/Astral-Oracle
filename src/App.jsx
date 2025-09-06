// dependencies
import { useEffect, useState } from 'react';
import i18n from './assets/i18n';
import {
  getCookie,
  handleCookieAccept,
  handleCookieDecline,
  saveCardToHistory,
} from './js/cookie';
import {
  updateTotalDrawnCards,
  saveTarotResponse,
} from './js/database';
import Groq from 'groq-sdk';

// component
import CookieConsent from './components/cookie';
import HistorySidebar from './components/history';

// assets
import { cardData, CardImage, IconHistory, IconLightBulOn } from './assets/index';
import './css/App.css';

// config
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });
const groqModel = import.meta.env.VITE_GROQ_MODEL;

function App() {
  //---------------------------------------- Setup State ----------------------------------------//
 
  // ดึงข้อมูลการ์ด Tarot
  const [cards, setCards] = useState([]);
  const [prevCards, setPrevCards] = useState([]);
  
  // จัดการการกรอกคำถาม
  const [userInput, setUserInput] = useState('');
  const [groqResponse, setGroqResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');

  // จัดการการแสดงผลในเว็ป
  const [loading, setLoading] = useState(false); 
  const [dots, setDots] = useState('');
  const [prediction, setPrediction] = useState(false);

  // จัดการภาษา
  const [language, setLanguage] = useState(i18n.language);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      setLanguage(lng);
    });
  };
  
  // คุกกี้
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setShowCookieConsent(true);
  }, []);

  //---------------------------------------- State Management ----------------------------------------//

  // สร้างการเคลื่อนไหวของจุด (dots) ในระหว่างที่กำลังโหลด
  useEffect(() => {
    let interval;
    if (loading) {

      // ตั้งเวลาเพื่อเพิ่มจุดในทุก ๆ 800 มิลลิวินาที สูงสุด 4 จุด
      interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 800);
    }

    // ทำความสะอาดเมื่อ loading เสร็จสิ้น
    return () => clearInterval(interval);
  }, [loading]);

  // แสดงข้อความจาก groqResponse ทีละตัวอักษร
  useEffect(() => {
    if (groqResponse && typeof groqResponse === 'string') {

      // รีเซ็ตการแสดงผล
      setDisplayedResponse('');
      let index = 0;

      // ตั้งเวลาเพื่อแสดงข้อความทีละตัวอักษร
      const interval = setInterval(() => {
        if (index < groqResponse.length - 1) {
          setDisplayedResponse(prev => prev + groqResponse[index]);
          index++;
        } else {
          clearInterval(interval); 
        }
      }, 30);
    }
  }, [groqResponse]);

  //---------------------------------------- Tarot API ----------------------------------------//

  // ดึงข้อมูลการ์ด Tarot
  const fetchCards = async (numCards) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {

      // ดึงข้อมูลการ์ดจาก API
      const response = await fetch(`https://tarotapi.dev/api/v1/cards/random?n=${numCards}`);
      const data = await response.json();

      // แปลงข้อมูลการ์ดโดยเพิ่มภาพ การกลับด้าน และองศาการหมุนของการ์ด
      const cardsWithOrientation = data.cards.map((card, index) => {
        const image = getCardImage(card.name_short);
        const isReversed = Math.random() > 0.5;
        const randomRotation = index > 0 ? Math.floor(Math.random() * 20) - 5 : 0;
        return { ...card, image, isReversed, rotation: randomRotation };
      });

      // อัพเดทจำนวนการ์ดทั้งหมดที่ถูกเล่นในเว็ปนี้
      await updateTotalDrawnCards(numCards);
  
      // ตั้งค่าการ์ดใหม่
      setCards(cardsWithOrientation);
      setPrevCards([cardsWithOrientation[0]]);
  
      // บันทึกการ์ดลงในประวัติ
      cardsWithOrientation.forEach(card => {
        saveCardToHistory(card);
      });
  
      // รีเซ็ตการตอบกลับของ Groq AI
      setGroqResponse('');
      setDisplayedResponse('');
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };  

  // ดึงภาพการ์ดจากข้อมูลการ์ด
  const getCardImage = (nameShort) => {
    const cardInfo = cardData.cards.find(card => card.name_short === nameShort); 
    return cardInfo ? cardInfo.image : cardImage; 
  };

  // จัดการการคลิกการ์ดเพื่อเปลี่ยนลำดับการแสดง
  const handleCardClick = () => {
    setCards(prevCards => {
      if (prevCards.length > 0) {

        // สลับลำดับการ์ดให้การ์ดใบแรกไปอยู่ใบสุดท้าย
        const firstCard = prevCards[0];
        const newCards = prevCards.slice(1); 
        setPrevCards(newCards);
        return [...newCards, firstCard];
      }
      return prevCards;
    });
  };

  //---------------------------------------- Groq API ----------------------------------------//

  // ดึงคำตอบจาก Groq AI โดยใช้การ์ดที่ดึงมาและคำถามของผู้ใช้
  const fetchGroqAI = async () => {
    if (!userInput || cards.length === 0) return; 
    setDisplayedResponse('');
    setPrediction(true);
    setLoading(true);
  
    // แปลงการ์ดที่ถูกดึงมาเป็นข้อความ
    const drawnCards = cards.map(card => `${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})`).join(', ');
  
    try {

      // กำหนดภาษาสำหรับการตอบสนองของ AI ตามการตั้งค่าภาษาปัจจุบัน
      const languagePreference = i18n.language === 'en' ? 'English' : 'Thai';

      // สร้างคำเตือนสำหรับการตอบสนองของ Groq AI
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a Tarot reader providing concise and insightful predictions based on Tarot cards.`,
          },
          {
            role: "user",
            content: `I have drawn the following cards: ${drawnCards}. My question is: ${userInput}`,
          },
        ],
        model: groqModel,
      });
  
      // ดึงข้อความจากการตอบกลับ
      const rawResponse = completion.choices[0]?.message?.content || "";
      const filteredResponse = rawResponse.split('\n').filter(line => line.trim() !== '').join(' ');
      console.log(filteredResponse);
      
      // บันทึกคำถามที่ถามกับแม่หมอ
      await saveTarotResponse(userInput, filteredResponse);

      // ตั้งค่าการตอบกลับของ Groq AI
      setGroqResponse(filteredResponse);
    } catch (error) {
      console.error('Error fetching from Groq AI:', error);
    } finally {
      setPrediction(false);
      setLoading(false);
    }
  };
  
  //---------------------------------------- Web UI ----------------------------------------//

  return (
    <>
      <header className='header'>
        {/* ชื่อเว็ป */}
        <h1>{i18n.t('name')}</h1>

        {/* Icon history */}
        <div className='icon-history' onClick={() => setShowHistory(prev => !prev)}>
          <img src={IconHistory} alt="History Icon" /> 
        </div>
      </header>

      {/* sidebar history */}
      <HistorySidebar showHistory={showHistory} onClose={() => setShowHistory(false)} />
      {showHistory && <div className="overlay" onClick={() => setShowHistory(false)} />}

      <main className='body'>
        <section className='left-side'>
          {/* รูปการ์ด */}
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
              <img className='card-image' src={CardImage} alt="card image" />
            )}
          </div>
          
          {/* ข้อความข้างใต้การ์ด */}
          {cards.length === 0 && !loading && (
              <h3>{i18n.t('pick')}</h3>
            )
          }
          {loading ? (
              <h3>{i18n.t(prediction ? 'prediction' : 'loading')}{dots}</h3>
            ) : (
              cards.length > 0 && (
                <h3>{cards[0].name}</h3>
              )
            )
          }

          {/* ปุ่มหยิบการ์ด */}
          <div className='draw-cards'>
            {[1, 3, 5].map(num => (
              <button 
                key={num} 
                className='draw-button' 
                onClick={() => fetchCards(num)}
              >
                {num} {i18n.t('card')}{num > 1 && i18n.language === 'en' ? 's' : ''}
              </button>
            ))}
          </div>
          
          {/* ถามคำถามสำหรับแม่หมอ */}
          {cards.length > 0 && (
            <div className='input-container'>
              <input
                className='ask-the-oracle'
                type='text'
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={i18n.t('ask')}
                style={{ paddingRight: userInput ? '46px' : '0' }}
              />
              {userInput && (
                <div className='icon-lightbul-on' onClick={() => { 
                    fetchGroqAI();
                    setUserInput(''); 
                }}>
                  <img src={IconLightBulOn} alt="Ask" />
                </div>
              )}
            </div>
          )}

          {/* คำตอบของแม่หมอ */}
          <div className='oracle-answer'>
            {loading && 
              <p>{i18n.t('oracle')}</p>
            }
            {displayedResponse && <p>{displayedResponse}</p>}
          </div>
        </section>
        
        <section className='right-side'>
          {cards.length === 0 && !loading ? (
            // ข้อความต้อนรับ
            <>
              {showCookieConsent && (
                <>
                  {(getCookie('cookieConsent') === 'true') ? (
                    <h2>{i18n.t('welcome')}</h2> // ไม่เคยเข้ามา
                  ) : (
                    <h2>{i18n.t('welcomeAgain')}</h2> // เคยเข้ามาแล้ว
                  )}
                  <CookieConsent 
                    hasCookie={getCookie('cookieConsent') === 'true'}
                    onAccept={() => handleCookieAccept(setShowCookieConsent)}
                    onDecline={() => handleCookieDecline(setShowCookieConsent)}
                  />
                </>
              )}
              <p>{i18n.t('introduce1')}</p>
              <p>{i18n.t('introduce2')}</p>
              <p>{i18n.t('introduce3')}</p>
            </>
          ) : (
            // รายการการ์ดที่สุ่มได้
            cards.length > 0 && (
              cards.map((card, index) => (
                <div key={index}>
                  {prevCards.length > 0 && prevCards[0].name === card.name ? (
                      <h1 className='choosen-card'> {/* แสดงชื่อการ์ดใบแรกเด่น ๆ */}
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

      {/* แหล่งที่มา */}
      <footer className='footer'>
        <div className='source'>
          {[
            {
              label: 'Language',
              source: i18n.language === 'en' ? 'Thai' : 'English',
              link: '',
              onclick: () => changeLanguage(i18n.language === 'en' ? 'th' : 'en')
            },
            { label: 'Image', source: 'Daily Tarot Draw', link: 'https://www.dailytarotdraw.com/#gsc.tab=0' },
            { label: 'API', source: 'Tarot API', link: 'https://tarotapi.dev/' },
            { label: 'AI', source: 'Groq', link: 'https://groq.com/' },
            { label: 'Github', source: 'NsamaX', link: 'https://github.com/NsamaX/Astral-Oracle' },
          ].map(({ label, source, link, onclick }) => (
            <div className='source-item' key={label}>
              <p>{label}</p>
              {link ? (
                <a translate='no' href={link} target="_blank" rel="noopener noreferrer">
                  {source}
                </a>
              ) : (
                <span onClick={onclick} style={{ cursor: 'pointer', color: '#97C7CC', textDecoration: 'underline' }}>
                  {source}
                </span>
              )}
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}

export default App;
