// api/share/[uuid].js
const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  const { uuid } = req.query;
  if (!uuid) return res.status(404).send('Not Found');

  try {
    // 1) 로컬 index.html 읽기
    const indexPath = path.join(process.cwd(), 'public', 'index.html');
    let html = await fs.readFile(indexPath, 'utf8');

    // 2) 실제 운세 데이터 가져오기 (AWS API Gateway)
    const dataRes = await fetch(
      `https://lnif7s4nea.execute-api.ap-northeast-2.amazonaws.com/prod/share/${uuid}`
    );
    if (!dataRes.ok) return res.status(404).send('Data Not Found');
    const { name, fortune_date, message } = await dataRes.json();

    // 3) 메타 정보 만들기
    const d = new Date(fortune_date);
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const nameOnly = name.length > 1 ? name.slice(1) : name;
    const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`;
    const first = message.split('. ')[0] + '.';
    const desc  = `${first} AI가 예측한 운세를 확인해보세요!`;
    const img   = `https://www.luckstargram.com/logo.png`;
    const shareUrl = `https://www.luckstargram.com/share/${uuid}`;

    // 4) 플레이스홀더 치환
    html = html
      .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
      .replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${desc}" />`
      )
      .replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${title}" />`
      )
      .replace(
        /<meta property="og:description" content=".*?" \/>/,
        `<meta property="og:description" content="${desc}" />`
      )
      .replace(
        /<meta property="og:image" content=".*?" \/>/,
        `<meta property="og:image" content="${img}" />`
      )
      .replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${shareUrl}" />`
      );

    // 5) 응답
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(html);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};
