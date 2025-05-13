// pages/api/share/[uuid].ts
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const parts = url.pathname.split('/');
  const uuid = parts[parts.indexOf('share') + 1];
  if (!uuid) return new Response('Not Found', { status: 404 });

  // 1) 정적 index.html 가져오기
  let html: string;
  try {
    html = await fetch(`${origin}/index.html`).then(r => r.text());
  } catch {
    return new Response('Index not found', { status: 500 });
  }

  // 2) 운세 데이터 호출
  let data: {
    name: string;
    fortune_date: string;
    message: string;
  };
  try {
    const dataRes = await fetch(`${origin}/api/share/${uuid}`);
    if (!dataRes.ok) throw new Error();
    data = await dataRes.json();
  } catch {
    return new Response('Data not found', { status: 404 });
  }

  // 3) 메타 정보 생성
  const d = new Date(data.fortune_date);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const nameOnly = data.name.length > 1 ? data.name.slice(1) : data.name;
  const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`;
  const firstSentence = data.message.split('. ')[0] + '.';
  const description = `${firstSentence} AI가 예측한 운세를 확인해보세요!`;
  const image = `${origin}/logo.png`;
  const shareUrl = `${origin}/share/${uuid}`;

  // 4) 치환
  html = html
    .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content=".*" \/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<meta property="og:title" content=".*" \/>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta property="og:description" content=".*" \/>/,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta property="og:image" content=".*" \/>/,
      `<meta property="og:image" content="${image}" />`
    )
    .replace(
      /<meta property="og:url" content=".*" \/>/,
      `<meta property="og:url" content="${shareUrl}" />`
    );

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' },
  });
}
