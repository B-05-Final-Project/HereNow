'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSearchStore } from './searchStore';
import { useRouter } from 'next/navigation';

function WebRecentSearch() {
  const router = useRouter();

  const { storgeData, removeFromStorage, setIsbg } = useSearchStore();

  const handleClose = (i: string) => {
    removeFromStorage(i);
  };

  const originalData = storgeData.filter(
    (item, index, arr) => arr.indexOf(item) === index,
  );

  const handleMoveClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    router.push(`/search-page?q=${target.innerHTML}`);
    setIsbg(false);
  };
  return (
    <div className="w-full h-screen fixed top-[78px] pt-[70px] px-[340px] bg-white">
      <div className="w-[1240px] flex flex-col gap-12">
        <div className="flex justify-between">
          <p className="text-[32px]">최근검색어</p>
          <button onClick={() => setIsbg(false)}>
            <XMarkIcon className="w-10 h-10" />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap justify-start">
          {originalData.map((item, index) => {
            if (item === '') {
              return null;
            }
            return (
              <div
                key={index}
                className="flex border-[2px] py-3 px-8 rounded-3xl hover:border-blue4 hover:bg-blue0 hover:text-main"
              >
                <li
                  className="list-none cursor-pointer justify-center items-center flex gap-[24px] text-2xl font-medium"
                  onClick={handleMoveClick}
                >
                  {item}
                  <button onClick={() => handleClose(item)}>
                    <XMarkIcon className="w-7 h-7" />
                  </button>
                </li>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WebRecentSearch;
