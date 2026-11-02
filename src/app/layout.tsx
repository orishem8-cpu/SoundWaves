import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"SoundWave — Продвижение музыки",description:"Профессиональное продвижение музыкальных релизов"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
