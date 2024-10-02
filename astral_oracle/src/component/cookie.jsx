import React from 'react';
import '../css/cookie.css';

const CookieConsent = ({ onAccept, onDecline }) => {
  return (
    <div className="cookie-consent">
      <p>This enchanted realm uses magical cookies to sprinkle joy upon your journey. By clicking "Accept," you embrace our whimsical use of these delightful treats! 🍪✨</p>
      <button onClick={onDecline}><h3>Decline</h3></button>
      <button onClick={onAccept}><h3>Accept</h3></button>
    </div>
  );
};

export default CookieConsent;
