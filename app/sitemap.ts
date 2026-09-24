import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/servicos", priority: 0.9, changeFrequency: "weekly" },
    { path: "/agendar", priority: 0.9, changeFrequency: "weekly" },
    { path: "/equipe", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contato", priority: 0.7, changeFrequency: "monthly" },
    { path: "/termos", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacidade", priority: 0.2, changeFrequency: "yearly" },
  ];
  return routes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
