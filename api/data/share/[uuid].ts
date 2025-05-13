// api/data/share/[uuid].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { uuid } = req.query as { uuid?: string };
  if (!uuid) return res.status(400).send('UUID required');

  try {
    const dataRes = await fetch(
      `https://lnif7s4nea.execute-api.ap-northeast-2.amazonaws.com/prod/share/${uuid}`
    );
    if (!dataRes.ok) return res.status(404).send('Not Found');
    const { name, fortune_date, message } = await dataRes.json();
    return res.status(200).json({ name, fortune_date, message });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Error');
  }
}
