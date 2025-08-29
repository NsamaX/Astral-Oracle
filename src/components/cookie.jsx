// dependencies
import i18n from '../assets/i18n'; 
import '../css/cookie.css';

const CookieConsent = ({ hasCookie, onAccept, onDecline }) => {
  return (
    <div className="cookie-consent">
      {hasCookie ? 
        <p>{i18n.t('cookieNotAccept')}</p> 
        : <p>{i18n.t('cookieAccepted')}</p>      
      }
      <button onClick={onDecline}><h3>{i18n.t('decline')}</h3></button>
      {!hasCookie ? 
        // ถ้ายังไม่มีคุกกี้จะแสดงปุ่ม Accept
        <button onClick={onAccept}><h3>{i18n.t('accept')}</h3></button> 
        : null
      }
    </div>
  );
};

export default CookieConsent;
