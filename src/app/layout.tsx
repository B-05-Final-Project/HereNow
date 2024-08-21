import ToastProvider from '@/providers/ToastProvider';
import type { Metadata } from 'next';
import '@/app/globals.css';
import QueryProvider from '@/providers/QueryProvider';
import localFont from 'next/font/local';
import Modal from '@/components/Modal/Modal';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  openGraph: {
    title: '지금, 여기',
    description: '로컬의 정보를 확인하고 공유할 수 있는 플랫폼입니다.',
    url: 'https://here-now-zeta.vercel.app',
    images: {
      url: 'https://here-now-zeta.vercel.app/readme-brochure.png',
      width: 2117,
      height: 1059,
    },
  },
  title: '지금, 여기',
  description: '로컬의 정보를 확인하고 공유할 수 있는 플랫폼입니다.',
  icons: {
    icon: '/Symbol.png',
  },
};

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} font-pretendard`}>
        <QueryProvider>
          <Modal />
          <div className="mx-auto">
            <ToastProvider>{children}</ToastProvider>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
export default RootLayout;
