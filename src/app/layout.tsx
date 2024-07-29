import ToastProvider from '@/providers/ToastProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import Footer from '@/components/Footer';
import Layoutheader from '@/components/LayoutHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '지금여기',
  description: '로컬의 정보를 확인하고 공유할 수 있는 플랫폼입니다.',
};

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="max-w-[400px] mx-auto">
            <Layoutheader />
            <div className="pt-[25px] pb-[70px]">
              <ToastProvider>{children}</ToastProvider>
              <Footer />
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
export default RootLayout;
