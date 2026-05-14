// src/App.tsx
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import SamplePage from './pages/Sample';
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

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="share/:uuid" element={<SharePage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="/sample" element={<SamplePage />} />
      </Route>
    </Routes>
  );
}

export default App;
