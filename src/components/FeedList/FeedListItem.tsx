import { Feed } from '@/types/feed';
import Image from 'next/image';
import { fromNow } from '@/utils/formatDate';
import { showToast } from '@/utils/toastHelper';
import Link from 'next/link';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';

function FeedListItem({
  feed,
  likesCount,
  commentsCount,
}: {
  feed: Feed;
  likesCount: number;
  commentsCount: number;
}) {
  let feedImage = '/No_Img.jpg';

  if (feed.image) {
    try {
      const parsedImage = JSON.parse(feed.image);
      feedImage = Array.isArray(parsedImage) ? parsedImage[0] : parsedImage;
    } catch (error) {
      console.error('Failed to parse feed image:', error);
      showToast('error', '이미지를 불러오는 중 오류가 발생했습니다.');
    }
  }
  return (
    <div>
      <Link href={`/feed-detail/${feed.id}`} className="p-4  rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image
              src={feed.Users?.profileImage || '/default-profile.jpg'}
              alt="유저 프로필 이미지"
              width={48}
              height={48}
              className="w-6 h-6 border rounded-full mr-4"
            />
            <span className="text-[14px] font-regular">
              {feed.Users?.nickname}
            </span>
          </div>
          <span className="text-[12px] text-[#767676]">
            {fromNow(feed.createdAt)}
          </span>
        </div>
        <div className="relative h-48">
          <Image
            src={feedImage}
            alt="피드 썸네일"
            width={300}
            height={200}
            className="object-cover w-full h-48 border rounded-3xl"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[#212125] text-[18px] font-semibold">
              {feed.title}
            </h2>
            <div className="flex items-center space-x-3 text-xs text-[#505050]">
              <div className="flex items-center space-x-1">
                <HeartIcon className="w-5 h-5 text-[#ff5c5c]" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                <span>{commentsCount}</span>
              </div>
            </div>
          </div>
          <p className="text-[14px] text-[#767676]">
            {feed.region && <span>{feed.region}</span>}
            {feed.region && feed.sigungu && ' '}
            {feed.sigungu && <span>{feed.sigungu}</span>}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default FeedListItem;
