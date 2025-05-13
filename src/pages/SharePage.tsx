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
  const [showModal, setShowModal] = useState(false);

  // ─── 사용/공유/수신 횟수 ───
  const storedUsed    = Number(localStorage.getItem('luckstar_usedCount')   || '0');
  const storedShared  = Number(localStorage.getItem('luckstar_sharedCount') || '0');
  const storedReceive = Number(localStorage.getItem('luckstar_receiveCount')|| '0');
  const sharedCount   = storedShared;
  const receiveCount  = storedReceive;

  // ─── 남은 횟수 계산 ───
  const dailyLimit     = 1;
  const remainingCount = dailyLimit - storedUsed + sharedCount + receiveCount;

  // 1) 공유 전용 API 호출
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
      .then((json: ShareData) => {
        setData(json);
        setLoading(false);

        // ─── 여기가 추가된 부분: 메타 태그 동적 갱신 ───
        const dateObj = new Date(json.fortune_date);
        const mm = dateObj.getMonth() + 1;
        const dd = dateObj.getDate();
        const nameOnly = json.name.length > 1 ? json.name.slice(1) : json.name;
        const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`;
        const firstSentence = json.message.split('. ')[0] + '.';
        const description = `${firstSentence} AI가 예측한 운세를 확인해보세요!`;

        document.title = title;

        const setMeta = (selector: string, attr: string, value: string) => {
          const el = document.querySelector(selector);
          if (el) el.setAttribute(attr, value);
        };

        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[name="twitter:title"]', 'content', title);

        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[name="description"]', 'content', description);
        setMeta('meta[name="twitter:description"]', 'content', description);
        // ────────────────────────────────────────────────

      })
      .catch(err => {
        console.error(err);
        setError('공유된 운세를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [paramUuid, navigate]);

  // 2) 로고 클릭 → 메인
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

  // 3) “나의 운세 보러가기” → 티켓 받은 후 홈
  const handleReceive = () => {
    if (!paramUuid) return navigate('/');
    const claimKey = `luckstar_receiveClaimed_${paramUuid}`;
    if (!localStorage.getItem(claimKey)) {
      localStorage.setItem('luckstar_receiveCount', String(receiveCount + 1));
      localStorage.setItem(claimKey, '1');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 2000);
    } else {
      navigate('/');
    }
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

  const { name,  fortune_date, message, action_tip } = data;
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

        {/* 남은 티켓 수 표시 */}
        <p
          className="animate-pulse-soft"
          style={{
            width: '100%',
            textAlign: 'center',
            margin: '0.5rem 0 0.5rem',
            fontWeight: 600,
            fontSize: '15px',
            color: remainingCount > 0 ? '#6ee7b7' : '#f43f5e',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          🎟️ 보유 티켓 x {remainingCount}장
        </p>

        {/* 나의 운세 보러가기 버튼 */}
        <button
          onClick={handleReceive}
          className="fortune-btn fixed-width-btn mb-4"
        >
          🎟️ 티켓 받고, 나만의 운세 보러가기
        </button>

        {/* 수신 완료 모달 */}
        <Modal
          isOpen={showModal}
          message="🎁 티켓 한 장이 선물로 도착했어요!"
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

export default SharePage;