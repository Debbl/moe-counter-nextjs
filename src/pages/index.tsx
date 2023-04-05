import { useEffect, useState } from "react";
import type { Theme } from "~/types";

const THEME = [
  "asoul",
  "gelbooru",
  "gelbooru-h",
  "moebooru",
  "moebooru-h",
  "rule3",
] as const;

export default function Home() {
  const [info, setInfo] = useState<{ url: string; name: string; theme: Theme }>(
    {
      url: "",
      name: "debbl",
      theme: THEME[1],
    }
  );
  const [renderSVG, setRenderSVG] = useState("");

  const getEndpoint = (url: string, name: string, theme: Theme) => {
    return `${url}/counter/${name}?theme=${theme}`;
  };

  const handleClick = async () => {
    if (!info.name) return;
    const endpoint = getEndpoint(info.url, info.name, info.theme);
    const str = await (await fetch(endpoint)).text();
    setRenderSVG(str);
  };

  useEffect(() => {
    const url = `${window.location.protocol}//${window.location.host}`;
    setInfo({
      ...info,
      url,
    });
    const endpoint = getEndpoint(url, info.name, info.theme);
    fetch(endpoint)
      .then((res) => res.text())
      .then((str) => setRenderSVG(str));
  }, []);

  return (
    <div>
      <div className="font-normal w-[980px] mx-auto mt-10 flex flex-col items-center gap-y-6">
        <h1 className="font-bold text-2xl">Moe Counter</h1>
        <div>
          <span>https://moe-counter-nextjs.vercel.app/counter/</span>
          <input
            type="text"
            value={info.name}
            placeholder="Your name"
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className="border mx-3 w-32 rounded px-1"
          />
          <span>?</span>
          <span>theme=</span>
          <select
            value={info.theme}
            onChange={(e) =>
              setInfo({ ...info, theme: e.target.value as Theme })
            }
            className="border mx-3 rounded"
          >
            {THEME.map((t) => (
              <option value={t} key={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            disabled={info.name === ""}
            onClick={() => handleClick()}
            className="border disabled:opacity-50 shadow px-6 rounded enabled:active:scale-95"
          >
            GET
          </button>
        </div>
        <div>
          {renderSVG && (
            <div dangerouslySetInnerHTML={{ __html: renderSVG }}></div>
          )}
        </div>
      </div>
    </div>
  );
}
