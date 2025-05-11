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

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLImageElement | null>(null);

  /* ---------- 로컬 스토리지 초기값 ---------- */
  const savedName = localStorage.getItem('luckstar_name') || '';
  const savedBirth = localStorage.getItem('luckstar_birth') || '';
  const initialName = location.state?.name || savedName;
  const initialBirth = location.state?.birthDate || savedBirth;

  /* ---------- 날짜 ---------- */
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}`;

  /* ---------- 상태 ---------- */
  const [name, setName] = useState(initialName);
  const [birthDate, setBirthDate] = useState(initialBirth);
  const [fortuneDate, setFortuneDate] = useState(todayStr);
  const [isLoading, setIsLoading] = useState(false);
  const [showNameError, setShowNameError] = useState(false); // 오류 플래그

  /* ---------- 로컬 저장 ---------- */
  useEffect(() => {
    if (name) localStorage.setItem('luckstar_name', name);
    if (birthDate) localStorage.setItem('luckstar_birth', birthDate);
  }, [name, birthDate]);

  /* ---------- 로고 애니메이션 ---------- */
  const animateLogo = useCallback(() => {
    const el = logoRef.current;
    if (el) {
      el.classList.remove('animate__jello');
      void el.offsetWidth;
      el.classList.add('animate__jello');
    }
  }, []);

  /* ---------- 제출 ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이름 검증 (완성형 한글 only 또는 영문 only)
    if (!KOREAN_REGEX.test(name) && !ENGLISH_REGEX.test(name)) {
      setShowNameError(true);
      setTimeout(() => setShowNameError(false), 2000); 
      return;
    }

    setIsLoading(true);
    const start = Date.now();

    try {
      const qs = new URLSearchParams({
        name,
        birth_date: birthDate,
        fortune_date: fortuneDate,
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/fortune?${qs}`,
      );
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      // 최소 로딩 3초 보장
      const elapsed = Date.now() - start;
      if (elapsed < 3000)
        await new Promise(r => setTimeout(r, 3500 - elapsed));

      setIsLoading(false);
      navigate('/result', { state: data });
    } catch (err) {
      console.error(err);
      alert('운세를 불러오는 데 실패했어요 🥲');
      setIsLoading(false);
    }
  };

  /* ---------- Header ---------- */
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

  /* ---------- 로딩 화면 ---------- */
  if (isLoading) {
    return (
      <div className="fortune-bg">
        <div className="frame relative flex flex-col items-center pt-8">
          <Header />
          {/* 스켈레톤 */}
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

  /* ---------- 입력 폼 ---------- */
  return (
    <div className="fortune-bg">
      <div className="frame relative flex flex-col items-center pt-8">
        <Header />

        <form onSubmit={handleSubmit} className="fortune-form w-full">
          {/* 이름 */}
          <div className="fortune-input-wrap relative">
            {/* relative 추가 → 오류 메시지 absolute 배치 */}
            <label className="fortune-label">이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="fortune-input"
              placeholder="이름을 입력하세요"
              required
            />

            {/* 오류 메시지 (2초) */}
            {showNameError && (
              <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-red-400 text-sm whitespace-nowrap"
              style={{ color: '#f87171' }}>
                이름은 한글 또는 영문이여야 합니다.
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
          <div className="fortune-input-wrap">
            <label className="fortune-label">
              운세 날짜 <span className="fortune-note">(오늘 이전만 가능)</span>
            </label>
            <input
              type="date"
              value={fortuneDate}
              onChange={e => setFortuneDate(e.target.value)}
              className="fortune-input"
              min="2025-01-01"
              max={todayStr}
              required
            />
          </div>

          <button
            type="submit"
            className="fortune-btn fixed-width-btn transform transition hover:scale-105 active:scale-95"
          >
            AI가 예측한 나의 운세 보기
          </button>
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
