import React from 'react';
import '../css/cookie.css';

const CookieConsent = ({ hasCookie, onAccept, onDecline }) => {
  return (
    <div className="cookie-consent">
      {hasCookie ? 
        <p>
          Should you wish to leave the shadows of yore behind, simply summon the 'Decline' spell. 
          ✨ Our magical cookies, crafted from the essence of starlight, await you! 
          Click 'Accept' to revel in these delightful treasures and unlock wonders untold! 🍪
        </p> : <p>
          Should you choose to cast away the shadows of yore, simply summon the 'Decline' spell. 🌌 
          Remember, our enchanted cookies are crafted from stardust and bring joy to your mystical journey! 
          🌠 Click 'Accept' to embrace these whimsical treats and unlock a treasure trove of delight! ✨
        </p>      
      }
      <button onClick={onDecline}><h3>Decline</h3></button>
      {hasCookie ? 
        null 
        : <button onClick={onAccept}><h3>Accept</h3></button>
      }
    </div>
  );
};

export default CookieConsent;
