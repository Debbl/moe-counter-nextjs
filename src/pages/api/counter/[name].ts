// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import kv from "@vercel/kv";
import getThemeList from "~/data/getThemeList";
import type { Theme } from "~/types";

async function getCountByName(name: string) {
  const count = (await kv.get<number>(name)) || 0;
  if (!count) {
    await kv.set(name, 1);
    return count;
  }
  await kv.set(name, count + 1);
  return count + 1;
}

async function getCountImage(name: string, theme: Theme, length = 7) {
  const count = await getCountByName(name);
  const themeList = getThemeList()[theme];

  const countArray = count.toString().padStart(length, "0").split("");
  let x = 0;
  let y = 0;

  const parts = countArray.reduce((acc, next) => {
    const { width = 45, height = 100, data } = themeList[next];
    const image = `${acc}
        <image x="${x}" y="0" width="${width}" height="${height}" xlink:href="${data}" />`;
    x += width;
    if (height > y) y = height;
    return image;
  }, "");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${x}" height="${y}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Moe Count</title>
    <g>
      ${parts}
    </g>
</svg>
`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { name = "", theme = "moebooru" } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader(
    "Cache-Control",
    "max-age=0, no-cache, no-store, must-revalidate"
  );

  const renderSVG = await getCountImage(name as string, theme as Theme);
  res.send(renderSVG);
}
