import React from 'react';
import '../css/cookie.css';

const CookieConsent = ({ onAccept, onDecline }) => {
  return (
    <div className="cookie-consent">
      <h3>✨ Greetings, Curious Traveler! ✨</h3>
      <p>This enchanted realm uses magical cookies to sprinkle joy upon your journey.</p>
      <p>By clicking "Accept," you embrace our whimsical use of these delightful treats! 🍪✨</p>
      <button onClick={onDecline}><h3>Decline</h3></button>
      <button onClick={onAccept}><h3>Accept</h3></button>
    </div>
  );
};

export default CookieConsent;
