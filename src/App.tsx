// src/App.tsx
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import SharePage from './pages/SharePage';

function App() {
  // ─── 자정 초기화 로직 ───
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastReset = localStorage.getItem('luckstar_lastResetDate');
    if (lastReset !== todayKey) {
      localStorage.setItem('luckstar_usedCount', '0');
      localStorage.setItem('luckstar_sharedCount', '0');
      localStorage.setItem('luckstar_receiveCount', '0');
      localStorage.setItem('luckstar_lastResetDate', todayKey);
    }
  }, []);

  // ─── 메타 태그 결정 ───
  const renderMeta = () => {
      return (
        <Helmet>
          <title>LuckStargram 🍀</title>
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.luckstargram.com/" />
          <meta property="og:title" content="LuckStargram 🍀" />
          <meta property="og:description" content="AI가 예측한 나만의 운세를 지금 바로 확인해보세요!" />
          <meta property="og:image" content="https://www.luckstargram.com/logo.webp" />
        </Helmet>
      );
    return null;
  };

  return (
    <>
      {renderMeta()}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="share/:uuid" element={<SharePage />} />
          <Route path="result" element={<ResultPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;