// src/pages/SharePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import './HomePage.css';

interface ShareData {
  uuid: string;
  name: string;
  birth_date: string;
  fortune_date: string;
  message: string;
  action_tip: string;
}

const SharePage: React.FC = () => {
  const { uuid: paramUuid } = useParams<{ uuid: string }>();
  const navigate           = useNavigate();
  const logoRef            = useRef<HTMLImageElement>(null);

  const [data,    setData]    = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [receiveCount, setReceiveCount] = useState(
    Number(localStorage.getItem('luckstar_receiveCount') || '0')
  );

  // 1) 공유용 API 호출
  useEffect(() => {
    if (!paramUuid) {
      navigate('/', { replace: true });
      return;
    }
    fetch(`${import.meta.env.VITE_API_BASE_URL}/share/${paramUuid}`)
      .then(res => {
        if (!res.ok) throw new Error('공유 내용을 불러올 수 없습니다.');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('공유된 운세를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [paramUuid, navigate]);

  // 2) 로고 클릭 시 메인으로
  const handleLogoClick = () => {
    const el = logoRef.current;
    if (el) {
      el.classList.remove('animate__jello');
      void el.offsetWidth;
      el.classList.add('animate__jello');
      setTimeout(() => navigate('/'), 400);
    } else {
      navigate('/');
    }
  };

  // 3) “나의 운세 보러가기” 클릭 → receiveCount ↑ 1회만, 모달, 홈 이동
  const handleReceive = () => {
    if (!paramUuid) {
      navigate('/');
      return;
    }
    const claimKey = `luckstar_receiveClaimed_${paramUuid}`;
    // 이미 받은 적이 있으면 바로 홈으로
    if (localStorage.getItem(claimKey)) {
      navigate('/');
      return;
    }
    // 최초 클릭 시에만 +1
    const next = receiveCount + 1;
    setReceiveCount(next);
    localStorage.setItem('luckstar_receiveCount', String(next));
    localStorage.setItem(claimKey, '1');

    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      navigate('/');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="fortune-bg">
        <div className="frame relative flex flex-col items-center pt-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fortune-bg">
        <div className="frame relative flex flex-col items-center pt-8">
          <p className="text-white text-center">{error || '잘못된 접근입니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className="fortune-btn fixed-width-btn mt-4"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const { name, fortune_date, message, action_tip } = data;
  const nameOnly = name.length > 1 ? name.slice(1) : name;
  const dateObj  = fortune_date ? new Date(fortune_date) : new Date();
  const month    = dateObj.getMonth() + 1;
  const day      = dateObj.getDate();

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

        {/* 공유 페이지에서는 남은 횟수 문구 숨김 */}

        <button
          onClick={handleReceive}
          className="fortune-btn fixed-width-btn mb-4"
        >
          나의 운세 보러가기
        </button>

        <Modal
          isOpen={showModal}
          message="🎟️ 티켓을 한 장 받았어요!"
        />

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

export default SharePage;