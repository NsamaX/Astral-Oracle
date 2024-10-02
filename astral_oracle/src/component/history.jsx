import React, { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import image_icon from '../assets/card.png';
import '../css/history.css';

const HistorySidebar = ({ showHistory, onClose }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getCardHistory = () => {
    const history = Cookies.get('cardHistory');
    return history ? JSON.parse(history) : [];
  };

  const cardHistory = getCardHistory();
  
  return (
    <div ref={sidebarRef} className={`history-sidebar ${showHistory ? 'show' : ''}`}>
      <h1>History</h1>
      {cardHistory.length > 0 ? (
        cardHistory.map((entry, index) => (
          <div key={index} className='history-container'>
            <div className='history'>
              <div className='card'>
                <img src={entry.image || image_icon} alt="card" />
              </div>
              <div className='card-info'>
                <p>Date: {entry.date}</p>
                <p>Time: {entry.time}</p>
                <p>Card: {entry.card}</p>
              </div>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <p>No history available.</p>
      )}
      <br />
    </div>
  );
};

export default HistorySidebar;
