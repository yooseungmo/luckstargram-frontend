import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './HomePage.css';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    name = '',
    birth_date: birthDate = '',
    fortune_date: fortuneDate = '',
    message = '',
    action_tip = '',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (location.state as any) || {};

  const logoRef = useRef<HTMLImageElement>(null);
  const [showModal, setShowModal] = useState(false);
  const nameOnly = name.length > 1 ? name.slice(1) : name;

  // 날짜 파싱
  const dateObj = fortuneDate ? new Date(fortuneDate) : new Date();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://luckstargram.com');
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  const handleLogoClick = () => {
    const el = logoRef.current;
    if (el) {
      el.classList.remove('animate__jello');
      void el.offsetWidth;
      el.classList.add('animate__jello');
      setTimeout(() => {
        navigate('/', { state: { name, birthDate } });
      }, 400);
    } else {
      navigate('/', { state: { name, birthDate } });
    }
  };

  return (
    <div className="fortune-bg">
      <div className="frame relative flex flex-col items-center pt-8">
        <button
          type="button"
          onClick={handleLogoClick}
          className="logo-button focus:outline-none transform transition hover:scale-105 active:scale-95 mb-2"
        >
          <img
            ref={logoRef}
            src="/main.png"
            alt="LuckStargram"
            className="logo-img animate__animated"
          />
        </button>

        <p className="fortune-subtitle mb-4">
          ✨ 당신의 오늘, AI가 미리 알려드려요
        </p>

        <p className="text-white text-5xl font-semibold mb-6">
          {nameOnly}님의 {month}월 {day}일 운세입니다. 🥠
        </p>

        <div className="fortune-box">
          <p className="fortune-box-title">💬 오늘의 메시지</p>
          <p className="fortune-box-content">{message}</p>
          <div className="fortune-box-divider" />
          <p className="fortune-box-title">📌 Tip</p>
          <p className="fortune-box-content font-semibold text-yellow-300">
            {action_tip}
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="fortune-btn fixed-width-btn mb-4"
        >
          🔗 LuckStargram 링크 복사하기
        </button>
        <Modal
          isOpen={showModal}
          message="'https://luckstargram.com'이 복사되었습니다."
        />

        <a
          href="https://forms.gle/9NTGLxcsES7QkDTf6"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-inline-link"
        >
          Contact
        </a>
      </div>
    </div>
  );
};

export default ResultPage;
