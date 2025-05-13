// api/share/[uuid].js
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'

export default async (req, res) => {
  const { uuid } = req.query

  // 1) 운세 데이터 가져오기
  const apiRes = await fetch(`${process.env.VITE_API_BASE_URL}/share/${uuid}`)
  if (!apiRes.ok) {
    // 에러 시 그냥 index.html
    const fallback = fs.readFileSync(path.join(__dirname, '..', 'build', 'index.html'), 'utf8')
    res.setHeader('Content-Type', 'text/html')
    return res.send(fallback)
  }
  const data = await apiRes.json()

  // 2) 메타 정보 생성
  const date = new Date(data.fortune_date)
  const mm   = date.getMonth() + 1
  const dd   = date.getDate()
  const nameOnly = data.name.length > 1 ? data.name.slice(1) : data.name
  const title = `${nameOnly}님의 ${mm}월 ${dd}일 운세 🍀`
  const firstSentence = data.message.split('. ')[0] + '.'
  const desc = `${firstSentence} AI가 예측한 운세를 확인해보세요!`

  // 3) index.html 읽어서 치환
  const indexPath = path.join(process.cwd(), 'build', 'index.html')
  let html = fs.readFileSync(indexPath, 'utf8')

  html = html
    .replace(/<title>.*?<\/title>/, `<title>${title}<\/title>`)
    .replace(
      /<meta name="description" content=".*?"\s*\/?>/,
      `<meta name="description" content="${desc}" />`
    )
    .replace(
      /<meta property="og:title" content=".*?"\s*\/?>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta property="og:description" content=".*?"\s*\/?>/,
      `<meta property="og:description" content="${desc}" />`
    )
    .replace(
      /<meta name="twitter:description" content=".*?"\s*\/?>/,
      `<meta name="twitter:description" content="${desc}" />`
    )

  // 4) HTML 응답
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}