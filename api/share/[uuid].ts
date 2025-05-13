// api/share/[uuid].ts
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  console.log('🛠️ Edge Function hit for', req.url);
  const url = new URL(req.url);
  const origin = url.origin;
  const parts = url.pathname.split('/');
  const uuid = parts[parts.indexOf('share') + 1];
  if (!uuid) return new Response('Not Found', { status: 404 });

  // 1) 정적 index.html 가져오기
  const htmlRes = await fetch(`${origin}/index.html`);
  let html = await htmlRes.text();

  // 2) 운세 데이터 호출 (API Gateway or Vercel Function)
  const dataRes = await fetch(`${origin}/api/share/${uuid}`);
  if (!dataRes.ok) return new Response('Not Found', { status: 404 });
  const data = await dataRes.json();

  // 3) 치환할 메타 정보 만들기
  const date = new Date(data.fortune_date);
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const nameOnly = data.name.length > 1 ? data.name.slice(1) : data.name;
  const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`;
  const firstSentence = data.message.split('. ')[0] + '.';
  const description = `${firstSentence} AI가 예측한 운세를 확인해보세요!`;

  // 4) <head> 태그 치환 (index.html 구조에 맞춰 조정)
  html = html
    .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta property="og:title" content=".*" \/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta property="og:description" content=".*" \/>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(
      /<meta name="description" content=".*" \/>/,
      `<meta name="description" content="${description}" />`,
    );

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
