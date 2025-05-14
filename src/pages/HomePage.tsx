import 'animate.css';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './HomePage.css';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

const KOREAN_REGEX = /^[가-힣]+$/;
const ENGLISH_REGEX = /^[A-Za-z]+$/;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLImageElement | null>(null);
  const ticketRef = useRef<HTMLParagraphElement | null>(null);

  /* 오늘 날짜 */
  const now = new Date();
  const yearStr = String(now.getFullYear());
  const todayStr = `${yearStr}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}`;

  /* usedCount / sharedCount / receiveCount */
  const dailyLimit = 1;
  const usedCountStored = Number(localStorage.getItem('luckstar_usedCount') || '0');
  const sharedCountStored = Number(localStorage.getItem('luckstar_sharedCount') || '0');
  const receiveCountStored = Number(localStorage.getItem('luckstar_receiveCount') || '0');

  const [usedCount, setUsedCount] = useState(usedCountStored);
  const sharedCount = sharedCountStored;
  const receiveCount = receiveCountStored;

  /* 잔여횟수 계산 */
  const remainingCount = dailyLimit - usedCount + sharedCount + receiveCount;

  /* 초기값 계산 함수 */
  const getInitialBirth = () => {
    // 1) 라우터 state
    const nav = (location.state as any);
    if (nav?.birth_date) return nav.birth_date;
    if (nav?.birthDate)   return nav.birthDate;
    // 2) localStorage
    try {
      return localStorage.getItem('luckstar_birth') || '2000-01-01';
    } catch {
      return '2000-01-01';
    }
  };

  /* 로컬스토리지 초기값 (이름, 생년월일, 운세날짜) */
  const savedName = localStorage.getItem('luckstar_name') || '';
  const savedFortuneDate = localStorage.getItem('luckstar_fortune') || '';
  const initialName = location.state?.name || savedName;
  const initialBirth = getInitialBirth();
  const initialFortune =
    savedFortuneDate === todayStr ? savedFortuneDate : todayStr;

  /* 폼 상태 */
  const [name, setName] = useState(initialName);
  const [birthDate, setBirthDate] = useState<string>(() => initialBirth);
  const [fortuneDate, setFortuneDate] = useState(initialFortune);
  const [isLoading, setIsLoading] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);

  /* 폼 입력 로컬 저장 */
  useEffect(() => {
    if (name)        localStorage.setItem('luckstar_name',    name);
    if (birthDate)   localStorage.setItem('luckstar_birth',   birthDate);
    if (fortuneDate) localStorage.setItem('luckstar_fortune', fortuneDate);
  }, [name, birthDate, fortuneDate]);

  /* 로고 애니메이션 */
  const animateLogo = useCallback(() => {
    const el = logoRef.current;
    if (el) {
      el.classList.remove('animate__jello');
      void el.offsetWidth;
      el.classList.add('animate__jello');
    }
  }, []);

  /* ← 이전 결과 보기 (항상 /result 로 이동) */
  const handlePrev = () => {
    navigate('/result');
  };

  /* 운세 생성 or 이전결과 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 남은횟수 0이면 이전결과 보기
    if (remainingCount <= 0) {
      handlePrev();
      return;
    }

    // 이름 검증
    if (!KOREAN_REGEX.test(name) && !ENGLISH_REGEX.test(name)) {
      setShowNameError(true);
      setTimeout(() => setShowNameError(false), 3500);
      return;
    }
    // 올해 벨리데이션
    if (fortuneDate < `${yearStr}-01-01` || fortuneDate > `${yearStr}-12-31`) {
      setShowDateError(true);
      setTimeout(() => setShowDateError(false), 3500);
      return;
    }

    // 티켓 찢기 애니메이션
    if (ticketRef.current) {
      const el = ticketRef.current;
      el.classList.remove('animate__animated', 'animate__zoomOutUp');
      void el.offsetWidth;
      el.classList.add('animate__animated', 'animate__zoomOutUp');
      await new Promise(r => setTimeout(r, 1000));
    }

    setIsLoading(true);
    const start = Date.now();

    try {
      const qs = new URLSearchParams({
        name,
        birth_date:   birthDate,
        fortune_date: fortuneDate,
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/fortune?${qs}`
      );
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      // ─── 로컬스토리지에 결과 저장 ───
      localStorage.setItem('luckstar_lastResult', JSON.stringify(data));

      // 사용횟수 증가
      const newUsed = usedCount + 1;
      setUsedCount(newUsed);
      localStorage.setItem('luckstar_usedCount', String(newUsed));

      // 최소 3초 로딩 보장
      const elapsed = Date.now() - start;
      if (elapsed < 3000) await new Promise(r => setTimeout(r, 3500 - elapsed));

      setIsLoading(false);
      navigate('/result', { state: data });
    } catch (err) {
      console.error(err);
      alert('운세를 불러오는 데 실패했어요 🥲');
      setIsLoading(false);
    }
  };

  /* Header 컴포넌트 */
  const Header = useMemo(
    () =>
      memo(() => (
        <>
          <button
            type="button"
            onClick={animateLogo}
            className="logo-button focus:outline-none"
          >
            <img
              ref={logoRef}
              src="/main.png"
              alt="LuckStargram"
              className="logo-img animate__animated"
            />
          </button>
          <p className="fortune-subtitle mb-6">
            ✨ 당신의 오늘, AI가 미리 알려드려요
          </p>
        </>
      )),
    [animateLogo],
  );

  /* 로딩 화면 */
  if (isLoading) {
    return (
      <div className="fortune-bg">
        <div className="frame relative flex flex-col items-center pt-8">
          <Header />
          <div className="animate-pulse space-y-4 w-full mt-4">
            <div className="h-8 bg-white/20 rounded w-3/4 mx-auto" />
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto" />
            <div className="h-40 bg-white/20 rounded mx-4" />
            <div className="h-10 bg-white/20 rounded w-2/3 mx-auto" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <LoadingSpinner />
            <div className="loader mt-8" />
            <p className="loader-message text-white text-5xl font-semibold animate__animated animate__fadeInUp">
              AI가 열심히 예측 중이에요...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* 입력 폼 */
  return (
    <div className="fortune-bg">
      <div className="frame relative flex flex-col items-center pt-8">
        <Header />

        <form onSubmit={handleSubmit} className="fortune-form w-full">
          {/* 이름 */}
          <div className="fortune-input-wrap relative">
            <label className="fortune-label">이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="fortune-input"
              placeholder="이름을 입력하세요"
              required
            />
            {showNameError && (
              <span className="fortune-error">
                * 이름은 한글 또는 영문이여야 합니다.
              </span>
            )}
          </div>

          {/* 생년월일 */}
          <div className="fortune-input-wrap">
            <label className="fortune-label">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="fortune-input"
              min="1900-01-01"
              max={todayStr}
              required
            />
          </div>

          {/* 운세 날짜 */}
          <div className="fortune-input-wrap relative">
            <label className="fortune-label">운세 날짜</label>
            <input
              type="date"
              value={fortuneDate}
              onChange={e => setFortuneDate(e.target.value)}
              className="fortune-input"
              min={`${yearStr}-01-01`}
              max={`${yearStr}-12-31`}
              required
            />
            {showDateError && (
              <span className="fortune-error">
                * 올해 날짜만 선택할 수 있어요.
              </span>
            )}
          </div>

          {/* 남은 생성 가능 횟수 */}
          <p
            ref={ticketRef}
            className={ 'animate-pulse-soft' }
            style={{
              width: '100%',
              textAlign: 'center',
              margin: '0.3rem 0 -1.1rem',
              fontWeight: 600,
              fontSize: '15px',
              color: remainingCount > 0 ? '#6ee7b7' : '#f43f5e',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
            }}
          >
            🎟️ 보유 티켓 x {remainingCount}장
          </p>

          {/* 운세 생성 or 이전결과 보기 */}
          <button
            type="submit"
            className="fortune-btn fixed-width-btn transform transition hover:scale-105 active:scale-95"
          >
            {remainingCount > 0
              ? 'AI가 예측한 나만의 운세 보기'
              : '🔗 이전 결과 공유하고, 티켓 받기'}
          </button>

          {/* 티켓 안내 */}
          <div
            className="w-full text-left text-xs text-gray-500 mb-4"
            style={{
              margin: '-1rem 0 0.5rem',
              fontWeight: 200,
              fontSize: '0.72rem',
              lineHeight: 1.4,
              color: '#6B7280', 
            }}
          >
            <strong className="block mb-1"># 티켓 안내</strong> <br/>
            • 하루 1장 기본 제공 · 공유 및 링크 통해 추가 획득 가능<br />
            • 티켓은 매일 자정에 초기화돼요.
          </div>

        </form>

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

export default HomePage;
