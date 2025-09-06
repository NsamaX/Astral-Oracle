// dependencies
import { useEffect, useRef } from 'react';
import i18n from '../assets/i18n.js'; 
import Cookies from 'js-cookie';

// assets
import { CardImage } from '../assets/index.js';
import '../css/history.css';

const HistorySidebar = ({ showHistory, onClose }) => {
  const sidebarRef = useRef(null);

  // ปิด sidebar เมื่อคลิกนอก sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    // เพิ่ม listener สำหรับคลิก
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // ดึงประวัติการ์ดจากคุกกี้
  const getCardHistory = () => {
    const history = Cookies.get('cardHistory');
    return history ? JSON.parse(history) : [];
  };

  // เก็บประวัติการ์ดที่ดึงมาได้
  const cardHistory = getCardHistory();
  
  return (
    <div ref={sidebarRef} className={`history-sidebar ${showHistory ? 'show' : ''}`}>
      <h1>{i18n.t('historyTitle')}</h1>
      {cardHistory.length > 0 ? (
        // แสดงประวัติการ์ดแต่ละรายการ
        cardHistory.map((entry, index) => (
          <div key={index} className='history-container'>
            <div className='history'>
              <div className='card'>
                <img src={entry.image || CardImage} alt="card" style={{ transform: entry.orientation === 'Reversed' ? 'scale(-1)' : '' }} />
              </div>
              <div className='card-info'>
                <p>{i18n.t('date')}: {entry.date}</p>
                <p>{i18n.t('time')}: {entry.time}</p>
                <p>{i18n.t('card')}: {entry.card}</p>
              </div>
            </div>
            <hr />
          </div>
        ))
      ) : (
        // ข้อความแสดงเมื่อไม่มีประวัติการ์ด
        <p>{i18n.t('history')}</p>
      )}
      <br />
    </div>
  );
};

export default HistorySidebar;
