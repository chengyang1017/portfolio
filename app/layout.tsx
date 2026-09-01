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
  title: 'Lim Cheng Yang — Software Projects',
  description:
    'Portfolio of Lim Cheng Yang documenting public software repositories and one project in development.',
  applicationName: 'Lim Cheng Yang Portfolio',
  authors: [{ name: 'Lim Cheng Yang' }],
  openGraph: {
    title: 'Lim Cheng Yang — Software Projects',
    description:
      'Software projects across language tooling, mobile applications, developer tools, commerce, and backend systems.',
    siteName: 'Lim Cheng Yang Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Lim Cheng Yang — Software Projects',
    description:
      'Software projects across language tooling, mobile applications, developer tools, commerce, and backend systems.',
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
