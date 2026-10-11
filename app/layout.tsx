import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flavor Persona | 人格原液",
  description: "将 16 种 MBTI 原型蒸馏为一杯流动的人格原液。输入授权码，开始你的风味测试。",
  openGraph: {
    title: "Flavor Persona | 人格原液",
    description: "一杯萃取液，揭示你生命最真实的底色。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
