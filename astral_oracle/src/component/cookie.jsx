import React from 'react';
import '../css/cookie.css';

const CookieConsent = ({ onAccept, onDecline }) => {
  return (
    <div className="cookie-consent">
      <p>This website uses cookies to enhance your experience. By clicking "Accept", you agree to our use of cookies.</p>
      <button onClick={onDecline}><h3>Decline</h3></button>
      <button onClick={onAccept}><h3>Accept</h3></button>
    </div>
  );
};

export default CookieConsent;
