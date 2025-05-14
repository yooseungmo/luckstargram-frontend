import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './HomePage.css';

interface ShareData {
  name: string;
  birth_date: string;
  fortune_date: string;
  message: string;
  action_tip: string;
  // uuid: string;
  short_link: string;       
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ─── 네비 State에서 데이터 추출 ───
  const {
    name = '',
    birth_date = '',
    fortune_date = '',
    message = '',
    action_tip = '',
    // uuid = '',
    short_link = '',  
  } = (location.state as ShareData) || {};

  // ─── 사용/공유/수신 횟수 ───
  const storedUsed    = Number(localStorage.getItem('luckstar_usedCount')   || '0');
  const storedShared  = Number(localStorage.getItem('luckstar_sharedCount') || '0');
  const storedReceive = Number(localStorage.getItem('luckstar_receiveCount')|| '0');
  const [sharedCount, setSharedCount] = useState(storedShared);
  const receiveCount = storedReceive;
  const dailyLimit   = 1;
  const remainingCount = dailyLimit - storedUsed + sharedCount + receiveCount;

  // ─── 로고 애니메이션 & 복원 ───
  const logoRef = useRef<HTMLImageElement>(null);
  const handleLogoClick = () => {
    const el = logoRef.current;
    if (el) {
      el.classList.remove('jello');
      void el.offsetWidth;
      el.classList.add('jello');
      setTimeout(() => navigate('/', { state: { name, birth_date } }), 400);
    } else {
      navigate('/', { state: { name, birth_date } });
    }
  };

  // ─── 새로고침 시 홈으로 리다이렉트 ───
  useEffect(() => {
    if (!location.state) {
      const saved = localStorage.getItem('luckstar_lastResult');
      if (saved) {
        const data = JSON.parse(saved);
        navigate('/result', { replace: true, state: data });
      } else {
        navigate('/', { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── 날짜 파싱 ───
  const dateObj = fortune_date ? new Date(fortune_date) : new Date();
  const month   = dateObj.getMonth() + 1;
  const day     = dateObj.getDate();

  // ─── 공유 버튼 처리 (짧은 링크 생성 & 전달) ───
  const [showModal, setShowModal] = useState(false);
  const handleShare = async () => {
    try {
      // 1) 숏링크 API 호출
      if (!short_link) {
        console.error('short_link가 없습니다!');
        return;
      }
      const shareUrl  = `https://share.luckstargram.com/${short_link}`;
      const shareText = `AI가 예측한 운세를 확인해보세요!\n\n${shareUrl}`;

      // 3) Web Share API or Clipboard
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
        await navigator.share({ text: shareText });
        onSuccess();
      } else {
        await navigator.clipboard.writeText(shareText);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      // 실패시 기본 링크 복사
      const fallback = `https://share.luckstargram.com/${short_link}`;
      await navigator.clipboard.writeText(fallback);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  // ─── 이름에서 한 글자 빼고 표시 ───
  const nameOnly = name.length > 1 ? name.slice(1) : name;

  return (
    <div className="fortune-bg">
      <div className="frame relative flex flex-col items-center pt-8">
        {/* 로고 */}
        <button onClick={handleLogoClick} className="logo-button focus:outline-none transform transition hover:scale-105 active:scale-95 mb-2">
          <img ref={logoRef} src="/main.webp" alt="LuckStargram" className="logo-img animate__animated" />
        </button>

        {/* 타이틀 */}
        <p className="fortune-subtitle mb-4">✨ 당신의 오늘, AI가 미리 알려드려요</p>
        <p className="text-white text-5xl font-bold mb-6">
          {nameOnly}님의 {month}월 {day}일 운세입니다 🥠
        </p>

        {/* 운세 카드 */}
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

        <p
          className="animate-pulse-soft"
          style={{
            width: '100%',
            textAlign: 'center',
            margin: '0.5rem 0 0.5rem 0', 
            fontWeight: 600,
            fontSize: '15px',
            color: remainingCount > 0 ? '#6ee7b7' : '#f43f5e',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          🎟️ 보유 티켓 x {remainingCount}장
        </p>

        {/* 공유 버튼 (handleShare 호출) */}
        <button onClick={handleShare} className="fortune-btn fixed-width-btn mb-4">
          🔗 운세 결과 공유하고, 티켓 받기
        </button>

        {/* 모달 */}
        <Modal
          isOpen={showModal}
          message={
            <span>
              <strong>🎁 공유 완료! 티켓 한 장이 선물로 도착했어요!</strong>
            </span>
          }
        />

        {/* 티켓 안내 */}
        <div
          className="self-start w-full text-left text-xs text-gray-500 mb-4"
          style={{
            alignSelf: 'flex-start',
            margin: '0.8rem 0 0.8rem',
            fontWeight: 200,
            fontSize: '0.72rem',
            lineHeight: 1.4,
            color: '#6B7280',
          }}
        >
          <strong className="block mb-1"># 티켓 안내</strong> <br/>
          • 하루 1장 기본 제공 · 공유 및 링크 통해 추가 획득 가능<br/>
          • 티켓은 매일 자정에 초기화돼요.
        </div>

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