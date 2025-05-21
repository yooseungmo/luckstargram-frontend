import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // 기존 스타일 재사용

/**
 * /sample – 고정 콘텐츠(정적 소개) 페이지
 * 1) 구글 애드센스 심사를 위한 고정 텍스트 & 예시 운세
 * 2) 실제 유저에게도 서비스 소개용으로 활용 가능
 */
const SamplePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fortune-bg">
      <div className="frame">
        <div className="frame__inner pt-8 pb-16 px-6 space-y-8 max-w-prose text-white">
          {/* ───── 로고 ───── */}
          <button
            onClick={() => navigate("/")}
            className="logo-button focus:outline-none transform transition hover:scale-105 active:scale-95 mb-2 mx-auto block"
          >
            <img src="/main.webp" alt="LuckStargram" className="logo-img" />
          </button>
          <br></br>
          {/* ───── 서비스 소개 ───── */}
          <section className="space-y-4">
            <p>
              <strong>LuckStargram</strong>은 이름과 생년월일을 입력하면 AI가 분석한 오늘의 운세를 보여주는
              재미·인사이트 제공 서비스입니다. 매일&nbsp;1,000+ 가지 운세 문구 풀에서 당신에게 꼭 맞는 메시지를
              선물해드려요.
            </p>
            <p>
              운세는 단순한 재미뿐 아니라 하루를 시작하는 긍정적 마음가짐을 돕습니다. 누구나 간단하게 &quot;나만의 운세&quot;를 받아보고,
              친구에게 공유해 🎟️ 티켓도 얻어 보세요!
            </p>
          </section>

          {/* ───── 사용 방법 ───── */}
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">How&nbsp;to&nbsp;Use 🚀</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm leading-6">
              <li>홈 화면에서 <em>이름 · 생년월일</em>을 입력하고 &lt;AI 운세 보기&gt; 버튼을 누릅니다.</li>
              <li>3초 내외 로딩 후, AI가 예측한 오늘의 운세와 행동 Tip이 제공돼요.</li>
              <li>결과를 친구에게 공유하면 추가 티켓 🎟️을 받아 또 다른 운세를 확인할 수 있어요.</li>
            </ol>
          </section>

          {/* ───── 운세 예시 카드 ───── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2">Sample&nbsp;Fortune&nbsp;Card 🥠</h2>
            <div className="fortune-box text-sm">
              <p className="fortune-box-title">‣ 오늘의 메시지</p>
              <p className="fortune-box-content" style={{ whiteSpace: "pre-line" }}>
                긍정적인 기운이 당신을 감싸고 있습니다. 새로운 도전을 두려워하지 마세요.
                당신의 열정이 주변 사람들에게도 좋은 영향력을 줄 거예요.
              </p>
              <div className="fortune-box-divider" />
              <p className="fortune-box-title">‣ Tip</p>
              <p className="fortune-box-content font-semibold text-yellow-300">
                파란색 아이템을 활용하면 행운이 배가됩니다💙
              </p>
            </div>
          </section>

          {/* ⬇️ 추가: 저작권 푸터 */}
        <p className="text-center text-xs text-gray-400 mt-4"
          style={{
            margin: '0.2rem 0 0.5rem',
            fontWeight: 200,
            fontSize: '0.8rem',
            lineHeight: 1.4,
            color: '#6B7280', 
          }}>
          © {new Date().getFullYear()} LuckStargram – AI Fortune Service
        </p>
        </div>
      </div>
    </div>
  );
};

export default SamplePage;
