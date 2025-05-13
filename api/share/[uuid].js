// api/share/[uuid].js
const fetch = require('node-fetch');
module.exports = async (req, res) => {
  try {
    const { uuid } = req.query;
    if (!uuid) return res.status(404).send('Not Found');

    // origin 계산
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${proto}://${host}`;

    // 1) index.html 가져오기
    const staticRes = await fetch(origin);
    if (!staticRes.ok) throw new Error('Index fetch failed');
    let html = await staticRes.text();

    // 2) 운세 데이터 가져오기
    const dataRes = await fetch(
      `https://lnif7s4nea.execute-api.ap-northeast-2.amazonaws.com/prod/share/${uuid}`
    );
    if (!dataRes.ok) return res.status(404).send('Data Not Found');
    const { name, fortune_date, message } = await dataRes.json();

    // 3) 메타 생성 & 치환 (이전 코드와 동일)
    const d = new Date(fortune_date);
    const mm = d.getMonth() + 1, dd = d.getDate();
    const nameOnly = name.length > 1 ? name.slice(1) : name;
    const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`;
    const first = message.split('. ')[0] + '.';
    const desc = `${first} AI가 예측한 운세를 확인해보세요!`;
    const img = `${origin}/logo.png`;
    const shareUrl = `${origin}/share/${uuid}`;
    html = html
      .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${img}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${shareUrl}" />`);

    // 4) 응답
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(html);
  } catch (err) {
    console.error('ERROR in /api/share/[uuid]:', err);
    return res.status(500).send('Internal Server Error');
  }
};
