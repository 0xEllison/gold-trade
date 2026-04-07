import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "贵金属行情看板",
  description: "实时贵金属行情数据",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="h-full">
      <body className={`${inter.className} h-screen overflow-hidden bg-[#111111] text-white`}>
        {children}
      </body>
    </html>
  );
}
