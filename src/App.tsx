// src/App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';

function App() {
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