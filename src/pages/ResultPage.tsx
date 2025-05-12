import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './HomePage.css';

const ResultPage: React.FC = () => {
  const navigate   = useNavigate();
  const location   = useLocation();

  // ─── 네비 State에서 데이터 추출 ───
  const {
    name = '',
    birth_date = '',
    fortune_date = '',
    message = '',
    action_tip = '',
    uuid = '',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (location.state as any) || {};

  // ─── 사용/공유/수신 횟수 ───
  const storedUsed    = Number(localStorage.getItem('luckstar_usedCount')   || '0');
  const storedShared  = Number(localStorage.getItem('luckstar_sharedCount') || '0');
  const storedReceive = Number(localStorage.getItem('luckstar_receiveCount')|| '0');

  const [sharedCount, setSharedCount]   = useState(storedShared);
  const receiveCount                    = storedReceive;

  // ─── 남은 횟수 계산 ───
  const dailyLimit     = 1;
  const remainingCount = dailyLimit - storedUsed + sharedCount + receiveCount;

  // ─── 로고 애니메이션 & 복원 ───
  const logoRef = useRef<HTMLImageElement>(null);
  const handleLogoClick = () => {
    const el = logoRef.current;
    if (el) {
      el.classList.remove('animate__jello');
      void el.offsetWidth;
      el.classList.add('animate__jello');
      setTimeout(() => navigate('/', { state: { name, birth_date } }), 400);
    } else {
      navigate('/', { state: { name, birth_date } });
    }
  };

  // ─── 새로고침 시 홈으로 리다이렉트 ───
  useEffect(() => {
    if (!location.state) navigate('/', { replace: true });
  }, []);

  // ─── 날짜 파싱 ───
  const dateObj = fortune_date ? new Date(fortune_date) : new Date();
  const month   = dateObj.getMonth() + 1;
  const day     = dateObj.getDate();

  // ─── 공유/복사 버튼 처리 ───
  const [showModal, setShowModal] = useState(false);
  const handleCopyLink = () => {
    const shareUrl = `https://luckstargram.com/share/${uuid}`;
    const shareData = { title: 'LuckStargram 🍀', url: shareUrl };

    const onSuccess = () => {
      setSharedCount(prev => {
        const next = prev + 1;
        localStorage.setItem('luckstar_sharedCount', String(next));
        return next;
      });
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    };

    if (navigator.share) {
      navigator.share(shareData).then(onSuccess).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        onSuccess();
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      onSuccess();
    }
  };

  // ─── 이름에서 한 글자 뺀 표시 ───
  const nameOnly = name.length > 1 ? name.slice(1) : name;

  return (
    <div className="fortune-bg">
      <div className="frame relative flex flex-col items-center pt-8">
        {/* 로고 & 애니메이션 */}
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

        {/* 서브타이틀 */}
        <p className="fortune-subtitle mb-4">
          ✨ 당신의 오늘, AI가 미리 알려드려요
        </p>

        {/* 메인 타이틀 */}
        <p className="text-white text-5xl font-bold mb-6">
          {nameOnly}님의 {month}월 {day}일 운세입니다 🥠
        </p>

        {/* 운세 결과 카드 */}
        <div className="fortune-box">
          <p className="fortune-box-title">‣ 오늘의 메시지</p>
          <p className="fortune-box-content" style={{ whiteSpace: 'pre-line' }}>
            {message.replace(/\. /g, '.\n')}
          </p>
          <div className="fortune-box-divider" />
          <p className="fortune-box-title">‣ Tip</p>
          <p className="fortune-box-content font-semibold text-yellow-300">
            {action_tip}
          </p>
        </div>

        {/* 남은 횟수 */}
        <p
          className="w-full text-center text-sm font-semibold"
          style={{
            margin: '0.1rem 0 0.5rem 0', 
            fontWeight: 500,
            color: remainingCount > 0 ? '#22c55e' : '#dc2626',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          * 오늘 남은 운세 기회: {remainingCount}회
        </p>

        {/* 공유 버튼 */}
        <button
          onClick={handleCopyLink}
          className="fortune-btn fixed-width-btn mb-4"
        >
          🔗 운세 결과 공유하고, 기회 받기
        </button>

        {/* 모달 */}
        <Modal
          isOpen={showModal}
          message="🎉 공유 완료! 운세 생성 기회가 늘어났어요!"
        />

        {/* Contact 링크 */}
        <a
          href="https://forms.gle/9NTGLxcsES7QkDTf6"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-inline-link"
        >
          Contact.
        </a>
      </div>
    </div>
  );
};

export default ResultPage;