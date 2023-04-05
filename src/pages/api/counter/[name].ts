// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getThemeList from "~/data/getThemeList";

export type Theme =
  | "asoul"
  | "gelbooru"
  | "gelbooru-h"
  | "moebooru"
  | "moebooru-h"
  | "rule34";

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_NAMESPACE_ID = process.env.CF_NAMESPACE_ID;
const CF_TOKEN = process.env.CF_TOKEN;

const getEndpoint = (key: string) => {
  return `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_NAMESPACE_ID}/values/${key}`;
};

async function getCountByName(name: string) {
  const endpoint = getEndpoint(name);
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
    },
  });
  const count = await response.text();

  const res = +count + 1;

  // write
  await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: `${res}`,
  });

  return res;
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
