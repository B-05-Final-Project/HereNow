'use client';
import WebFooter from '@/app/(webmain)/_componets/WebFooter';
import useAuthStore from '@/zustand/useAuthStore';
import {
  HomeIcon,
  Squares2X2Icon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import LoginPrompt from '@/components/LoginPrompt';
import { toast } from 'react-toastify';

function FooterMain() {
  const { user } = useAuthStore();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  const handleLoginPrompt = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast(<LoginPrompt />, {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      });
      return;
    }
  };

  useEffect(() => {
    // 윈도우 창의 크기를 감지하는 함수
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    // 컴포넌트가 처음 마운트 될 때와 창 크기 변화 시에 실행
    // 초기 실행
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);
  if (typeof window !== 'undefined') {
    return (
      <>
        {isMobile ? (
          <footer className="bg-white fixed z-10 right-0 p-1 w-full h-[72px] bottom-0 mx-auto">
            <div className="flex justify-between items-center h-full px-5">
              <Link
                href={'/'}
                className="w-[70px] h-[44px] flex flex-col items-center"
              >
                <HomeIcon className="w-5 h-5" />
                <p>홈</p>
              </Link>
              <Link
                href={'/feed'}
                className="w-[70px] h-[44px] flex flex-col items-center"
              >
                <Squares2X2Icon className="w-5 h-5" />
                <p>피드</p>
              </Link>
              {user ? (
                <Link
                  href={`/profile/${user.id}`}
                  className="w-[70px] h-[44px] flex flex-col items-center"
                >
                  <UserIcon className="w-5 h-5" />
                  <p>마이페이지</p>
                </Link>
              ) : (
                <button
                  onClick={handleLoginPrompt}
                  className="w-[70px] h-[44px] flex flex-col items-center"
                >
                  <UserIcon className="w-5 h-5" />
                  <p>마이페이지</p>
                </button>
              )}
            </div>
          </footer>
        ) : (
          <WebFooter />
        )}
      </>
    );
  }
  if (typeof window === 'undefined') return;
}

export default FooterMain;
