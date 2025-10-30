import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '임진석♥신해숙 결혼합니다',
  description: '2025년 11월 16일 일요일 오후 1시',
  openGraph: {
    title: '임진석♥신해숙 결혼합니다',
    description: '2025년 11월 16일 일요일 오후 1시',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
