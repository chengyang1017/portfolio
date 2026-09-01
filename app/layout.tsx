import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lim Cheng Yang — Software Engineer',
  description:
    'Lim Cheng Yang is a product-minded software engineer building thoughtful tools for language, learning, and everyday life.',
  applicationName: 'Lim Cheng Yang Portfolio',
  authors: [{ name: 'Lim Cheng Yang' }],
  openGraph: {
    title: 'Lim Cheng Yang — Software Engineer',
    description:
      'A developer portfolio focused on language technology, learning tools, and product engineering.',
    siteName: 'Lim Cheng Yang Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Lim Cheng Yang — Software Engineer',
    description:
      'A developer portfolio focused on language technology, learning tools, and product engineering.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
