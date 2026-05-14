import React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import "./HomePage.css"; // 기존 스타일 재사용

/**
 * /sample – 고정 콘텐츠(정적 소개) 페이지
 * 1) 구글 애드센스 심사를 위한 고정 텍스트 & 예시 운세
 * 2) 실제 유저에게도 서비스 소개용으로 활용 가능
 */
const SamplePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
    <SEO
      title="럭스타그램 LuckStargram 서비스 소개 - AI 무료 오늘의 운세 보는 법"
      description="럭스타그램(LuckStargram)은 AI가 분석한 오늘의 운세, 무료 사주, 별자리 운세를 알려주는 서비스입니다. 이름과 생년월일만 입력하면 매일 새로운 데일리 운세를 무료로 확인하고 친구와 공유할 수 있어요."
      url="https://www.luckstargram.com/sample"
    />
    <div className="fortune-bg">
      <div className="frame">
        <div className="frame__inner pt-8 pb-16 px-6 space-y-8 max-w-prose text-white">
          {/* ───── 로고 ───── */}
          <button
            onClick={() => navigate("/")}
            className="logo-button focus:outline-none transform transition hover:scale-105 active:scale-95 mb-2 mx-auto block"
          >
            <img src="/main.webp" alt="럭스타그램 LuckStargram - AI 오늘의 운세" className="logo-img" />
          </button>
          <h1 className="text-2xl font-bold text-center">
            럭스타그램 LuckStargram - AI 무료 오늘의 운세
          </h1>
          <br></br>
          {/* ───── 서비스 소개 ───── */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">럭스타그램(LuckStargram)이란?</h2>
            <p>
              <strong>럭스타그램(LuckStargram)</strong>은 이름과 생년월일을 입력하면 AI가 분석한
              <strong> 오늘의 운세</strong>를 무료로 보여주는 데일리 운세 서비스입니다.
              매일 1,000가지 이상의 운세 문구 중에서 당신에게 꼭 맞는 메시지를 선물해드려요.
              무료 사주, 별자리 운세, 띠별 운세, 오늘의 행운 정보까지 한번에 확인할 수 있습니다.
            </p>
            <p>
              운세는 단순한 재미뿐 아니라 하루를 시작하는 긍정적 마음가짐을 돕습니다. 누구나 간단하게 &quot;나만의 운세&quot;를 받아보고,
              친구에게 카카오톡, 인스타그램으로 공유해 🎟️ 티켓도 얻어 보세요!
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

          {/* ───── 자주 묻는 질문 (FAQ) ───── */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">자주 묻는 질문 (FAQ)</h2>

            <div>
              <h3 className="font-semibold">Q. 럭스타그램은 무료인가요?</h3>
              <p className="text-sm leading-6">
                네, 럭스타그램의 오늘의 운세, 사주, 별자리 운세 서비스는 모두 100% 무료입니다.
                회원가입 없이 이름과 생년월일만 입력하면 바로 무료 운세를 확인할 수 있어요.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Q. AI 운세는 어떻게 만들어지나요?</h3>
              <p className="text-sm leading-6">
                AI가 입력하신 이름과 생년월일, 그리고 오늘의 날짜를 종합 분석하여
                맞춤형 데일리 운세 메시지와 행운의 조언을 생성합니다. 매일 새로운 운세가 제공돼요.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Q. 오늘의 운세는 얼마나 자주 갱신되나요?</h3>
              <p className="text-sm leading-6">
                매일 자정(00:00)에 새로운 오늘의 운세가 갱신됩니다. 하루에 한 번 무료로 확인할 수 있고,
                친구에게 공유하면 추가 티켓을 받아 더 많은 운세를 볼 수 있어요.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Q. 운세를 친구에게 공유할 수 있나요?</h3>
              <p className="text-sm leading-6">
                네, 카카오톡, 인스타그램, 페이스북, 트위터 등 모든 SNS로 공유 가능합니다.
                공유 링크에는 미리보기 카드(OG 이미지)가 표시되어 친구들이 한눈에 운세 내용을 볼 수 있어요.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Q. 별자리 운세, 띠별 운세도 볼 수 있나요?</h3>
              <p className="text-sm leading-6">
                생년월일을 입력하시면 AI가 별자리와 띠를 자동으로 인식해서
                개인 맞춤형 운세를 제공해드립니다.
              </p>
            </div>
          </section>

          {/* ───── 관련 키워드 (SEO용) ───── */}
          <section className="text-xs text-gray-400 leading-relaxed">
            <p>
              <strong>관련 검색어:</strong> 오늘의 운세, 무료 운세, 운세 무료, 데일리 운세, 일일 운세,
              오늘 운세, AI 운세, 사주, 무료 사주, 사주 풀이, 별자리 운세, 띠별 운세, 신년 운세,
              오늘의 띠별 운세, 오늘의 별자리 운세, 운세 공유, 카톡 운세, 럭스타그램, LuckStargram,
              행운, 행운의 숫자, 행운의 색깔, 연애운, 금전운, 직장운, 학업운, 건강운, 오늘의 행운.
            </p>
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
    </>
  );
};

export default SamplePage;
