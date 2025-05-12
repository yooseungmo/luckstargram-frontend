import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';

function App() {
  // ─── 자정 초기화 로직 ───
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10); // "2025-05-13" 포맷
    const lastReset = localStorage.getItem('luckstar_lastResetDate');

    if (lastReset !== todayKey) {
      // 매일 첫 방문 시 실행
      localStorage.setItem('luckstar_usedCount', '0');
      localStorage.setItem('luckstar_sharedCount', '0');
      localStorage.setItem('luckstar_lastResetDate', todayKey);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout 바깥에 fortune-bg 가 한 번만 마운트 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="result" element={<ResultPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;