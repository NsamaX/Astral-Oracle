import Cookies from 'js-cookie';
import { deleteTarotResponses } from './database';

// แสดงข้อความขอความยินยอมคุกกี้
export const setShowCookieConsent = (setShowCookieConsent) => {
  setShowCookieConsent(true);
};

// ตั้งค่าคุกกี้พร้อมระบุวันหมดอายุ
export const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

// รับคุกกี้ตามชื่อ
export const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

// ฟังก์ชันสร้าง UUID สำหรับ `userId`
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// จัดการการยอมรับคุกกี้โดยผู้ใช้
export const handleCookieAccept = (setShowCookieConsent) => {
  localStorage.setItem('cookieConsent', 'true');
  setShowCookieConsent(false);
  setCookie('cookieConsent', 'true', 365);
  
  // สร้าง userId และเก็บในคุกกี้ถ้ายังไม่มี
  let userId = Cookies.get('userId');
  if (!userId) {
    userId = generateUUID();
    Cookies.set('userId', userId, { expires: 365 });
  }
};

// จัดการการปฏิเสธคุกกี้โดยผู้ใช้
export const handleCookieDecline = (setShowCookieConsent) => {
  setShowCookieConsent(false);
  deleteTarotResponses();
  Cookies.remove('userId');
  Cookies.remove('cardHistory');
  Cookies.remove('cookieConsent');
};

// บันทึกประวัติบัตรหากผู้ใช้ยินยอม
export const saveCardToHistory = (cardData) => {
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
