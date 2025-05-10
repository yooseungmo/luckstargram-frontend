// src/pages/ResultPage.tsx

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './HomePage.css'; // .logo-img, .logo-button, 애니메이션 클래스 정의

interface LocationState {
  name: string;
  birthDate: string;
  fortuneDate: string;
}

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, birthDate, fortuneDate } = (location.state as LocationState) || {};

  const [showModal, setShowModal] = useState(false);

  // 이름에서 성 제외
  const nameOnly = name?.length > 1 ? name.slice(1) : name || '';

  // 운세 날짜 파싱
  const dateObj = fortuneDate ? new Date(fortuneDate) : new Date();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();

  const fortuneData = {
    message: '오늘은 작은 오해가 큰 갈등으로 이어질 수 있어요. 대화 전에 한 번 더 생각하세요 🤐',
    action_tip: '말조심하기!',
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  // 로고 클릭 애니메이션 + 홈 이동
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
        {/* 로고 이미지 */}
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

        <p className="fortune-subtitle mb-4">✨ 당신의 오늘, AI가 미리 알려드려요</p>

        {/* 선택된 운세 날짜 (크기 키움) */}
        <p className="text-white text-5xl font-semibold mb-6">
          {nameOnly}님의 {month}월 {day}일 운세입니다. 🥠
        </p>

        {/* 운세 카드 */}
        <div className="fortune-box">
          <p className="fortune-box-title">💬 오늘의 메시지</p>
          <p className="fortune-box-content">{fortuneData.message}</p>
          <div className="fortune-box-divider" />
          <p className="fortune-box-title">📌 Tip</p>
          <p className="fortune-box-content font-semibold text-yellow-300">
            {fortuneData.action_tip}
          </p>
        </div>

        {/* 공유 버튼 */}
        <button onClick={handleCopyLink} className="fortune-btn fixed-width-btn">
          🔗 LuckStargram 링크 복사하기
        </button>

        <Modal isOpen={showModal} message="링크가 복사되었습니다" />

        <a
          href="https://forms.gle/9NTGLxcsES7QkDTf6"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-inline-link"
        >
          {/* 문의하기 */}
          Contact.
        </a>
      </div>
    </div>
  );
};

export default ResultPage;
