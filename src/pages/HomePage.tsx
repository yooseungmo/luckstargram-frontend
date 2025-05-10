import 'animate.css';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './HomePage.css';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLImageElement | null>(null);

  // 로컬 스토리지에서 이름/생일 복원
  const savedName = localStorage.getItem('luckstar_name') || '';
  const savedBirth = localStorage.getItem('luckstar_birth') || '';
  const initialName = location.state?.name || savedName;
  const initialBirth = location.state?.birthDate || savedBirth;

  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const todayStr = `${year}-${month}-${day}`;
  const minDate = '2025-01-01';

  const [name, setName] = useState(initialName);
  const [birthDate, setBirthDate] = useState(initialBirth);
  const [fortuneDate, setFortuneDate] = useState(todayStr);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (name) localStorage.setItem('luckstar_name', name);
    if (birthDate) localStorage.setItem('luckstar_birth', birthDate);
  }, [name, birthDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !fortuneDate) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/result', {
        state: { name, birthDate, fortuneDate },
      });
    }, 3500);
  };

  const handleLogoAnimate = () => {
    const el = titleRef.current;
    if (el) {
      el.classList.remove('animate__jello');
      void el.offsetWidth; // 리플로우 강제
      el.classList.add('animate__jello');
    }
  };

  const renderHeader = () => (
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
      <p className="fortune-subtitle mb-6">AI 기반 오늘의 운세 🍀</p>
    </>
  );

  if (isLoading) {
    return (
      <div className="fortune-bg">
        <div className="frame relative flex flex-col items-center pt-8">
          <Header />

          <div className="animate-pulse space-y-4 w-full">
            <div className="h-8 bg-white/20 rounded w-3/4 mx-auto" />
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto" />
            <div className="h-40 bg-white/20 rounded mx-4" />
            <div className="h-10 bg-white/20 rounded w-2/3 mx-auto" />
          </div>

          {/* 로딩 애니 */}
          <div className="mt-12 flex flex-col items-center">
            <LoadingSpinner />
            <div className="loader mt-8" />
            <p className="loader-message text-white text-xl font-bold animate__animated animate__fadeInUp">
              AI가 열심히 예측 중이에요...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fortune-bg">
      <div className="frame flex flex-col items-center pt-8 relative">
        {renderHeader()}

        <form onSubmit={handleSubmit} className="fortune-form w-full">
          <div className="fortune-input-wrap">
            <label className="fortune-label">이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="fortune-input"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="fortune-input-wrap">
            <label className="fortune-label">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="fortune-input"
              required
            />
          </div>

          <div className="fortune-input-wrap">
            <label className="fortune-label">
              운세 날짜 <span className="fortune-note">(오늘 이전)</span>
            </label>
            <input
              type="date"
              value={fortuneDate}
              onChange={e => setFortuneDate(e.target.value)}
              className="fortune-input"
              min={minDate}
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