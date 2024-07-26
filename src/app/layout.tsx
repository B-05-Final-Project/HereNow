import ToastProvider from '@/providers/ToastProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layoutheader from '@/components/Layoutheader';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '지금여기',
  description: '로컬의 정보를 확인하고 공유할 수 있는 플랫폼입니다.',
};

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-[400px] mx-auto h-screen">
          <Layoutheader />
          <ToastProvider>{children}</ToastProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
}
export default RootLayout;
