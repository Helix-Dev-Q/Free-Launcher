"use client";

import { Config } from "@/app/config/config";
import { useTheme } from "@/app/utils/hooks/theme";
import { NewsItem } from "@/app/utils/types/news";
import axios from "axios";
import { useEffect, useState } from "react";

export function NewsSection() {
  const colors = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    axios
      .get(`${Config.BACKEND_URL}:${Config.BACKEND_PORT}/api/v1/launcher/news`)
      .then((res) => setNews(res.data))
      .catch(() => {});
  }, []);

  const latest = news[0];

  return (
    <div className={`rounded-lg border p-4 ${colors.current.background2} ${colors.current.borderColor}`}>
      {latest ? (
        <>
          <p className={`text-xs mb-1 ${colors.current.foreground2}`}>{latest.about.date} · {latest.about.author}</p>
          <p className={`text-sm font-semibold ${colors.current.foreground}`}>{latest.body.title}</p>
          <p className={`text-xs mt-1 ${colors.current.foreground2}`}>{latest.body.message}</p>
        </>
      ) : (
        <p className={`text-xs ${colors.current.foreground2}`}>No news available.</p>
      )}
    </div>
  );
}
