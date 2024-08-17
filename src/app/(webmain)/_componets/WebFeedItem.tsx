'use client';

import { TableFeedType } from '@/types/mainTypes';
import { showToast } from '@/utils/toastHelper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

type itemProps = {
  item: TableFeedType;
};

function WebFeedItem({ item }: itemProps) {
  const router = useRouter();

  let feedImage = '/No_Img.jpg';
  if (item.image) {
    try {
      const parsedImage = JSON.parse(item.image) as string;
      feedImage = Array.isArray(parsedImage) ? parsedImage[0] : parsedImage;
    } catch (error) {
      console.error('Failed to parse feed image:', error);
      showToast('error', '피드이미지를 불러오는 중 오류가 발생하였습니다.');
    }
  }
  const handleMoveClick = (Id: number) => {
    router.push(`/feed-detail/${Id}`);
  };
  return (
    <div
      className="flex w-full cursor-pointer gap-4"
      onClick={() => handleMoveClick(item.id)}
    >
      <div className="w-[190px] h-[120px] shrink-0">
        <Image
          src={feedImage}
          alt="해당피드이미지"
          width={190}
          height={120}
          className="rounded-lg border w-full h-full object-cover"
        />
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center">
          <h2 className="font-semibold text-[16px] text-main line-clamp-1">
            {item.title}
          </h2>
          <p className="font-pretendard line-clamp-1 text-sm text-sub1">
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebFeedItem;
