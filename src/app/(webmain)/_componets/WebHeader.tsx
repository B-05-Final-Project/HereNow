'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { ChangeEvent, useEffect } from 'react';
import { useSearchStore } from './searchStore';
import WebRecentSearch from './WebRecentSearch';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import LoginPrompt from '@/components/LoginPrompt';
import useAuthStore from '@/zustand/useAuthStore';
import Image from 'next/image';

function WebHeader() {
  const router = useRouter();
  const { user, logOut } = useAuthStore();
  const {
    setIsbg,
    isbg,
    inputValue,
    setInputValue,
    initializeStorage,
    addToStorage,
  } = useSearchStore();
  useEffect(() => {
    initializeStorage();
  }, [initializeStorage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleClick = () => {
    router.push(`/search-page?q=${inputValue}`);
    setIsbg(false);
    addToStorage();
    setInputValue('');
  };
  const HandleOnClick = () => {
    if (!user) {
      toast(<LoginPrompt />, {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      });
    } else {
      router.push('/feed-write');
    }
  };
  const handleProfileImage = () => {
    router.push(`/profile/${user?.id}`);
  };
  const handleLogout = () => {
    window.location.reload();
    logOut();
  };
  return (
    <header className="w-full py-4 fixed right-0 left-0 mx-auto z-10 box-shadow bg-white flex justify-center items-center">
      <div className="flex gap-x-[90px] w-[1293px]">
        <div
          className="grow-0 font-medium text-[36px] flex justify-center items-center cursor-pointer"
          onClick={() => router.push('/')}
        >
          <p className="font-[양진체] text-blue4 shrink-0">지금,여기</p>
        </div>
        <form
          onClick={() => setIsbg(true)}
          onSubmit={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className="grow py-4 px-6 rounded-3xl bg-[#ecedef] flex justify-between gap-[240px]"
        >
          <input
            type="text"
            placeholder="검색창"
            className="w-full bg-[#ecedef] h-[18px]"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button>
            <MagnifyingGlassIcon className="w-4 h-4 text-gray8 shrink-0" />
          </button>
        </form>
        <div className="grow-0 flex justify-center items-center shrink-0">
          {user ? (
            <div className="flex gap-4 items-center justify-center">
              <div
                className="w-auto h-auto border rounded-full px-1 py-1 cursor-pointer"
                onClick={handleProfileImage}
              >
                <Image
                  src={`${user?.profileImage || '/user.png'}`}
                  alt="프로필 이미지"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div
                className="w-full h-full cursor-pointer"
                onClick={handleLogout}
              >
                <button className="text-sm font-normal leading-[150%]">
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={HandleOnClick}
              className="py-2 px-4 bg-orange3 rounded-lg text-base font-semibold leading-[150%] text-gray0"
            >
              시작하기
            </button>
          )}
        </div>
      </div>
      {isbg && <WebRecentSearch />}
    </header>
  );
}

export default WebHeader;
