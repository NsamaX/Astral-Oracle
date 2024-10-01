import React, { useEffect, useRef } from 'react';
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

  return (
    <div ref={sidebarRef} className={`history-sidebar ${showHistory ? 'show' : ''}`}>
      <h1>History</h1>
      <div className='history'>
        <div className='card'>
          <img src={image_icon} alt="card" />
        </div>
        <div className='card-info'>
          <p>Date: xx/xx/xxxx</p>
          <p>Time: xx:xx</p>
          <p>Card: xxxxxxxxx</p>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default HistorySidebar;
