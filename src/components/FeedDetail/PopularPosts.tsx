import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Post } from '@/types/post';
import { useRouter } from 'next/navigation';

const supabase = createClient();

type PostWithLikes = Post & {
  like_count?: number;
};

type PopularPostsProps = {
  userId: string;
  userNickname: string;
};

async function getPopularPosts(userId: string): Promise<PostWithLikes[]> {
  const { data: feeds, error: feedsError } = await supabase
    .from('Feeds')
    .select('id, title, image, region, sigungu, userId, content, createdAt')
    .eq('userId', userId);

  if (feedsError) {
    console.error('Error fetching feeds:', feedsError);
    return [];
  }

  const { data: likes, error: likesError } = await supabase
    .from('FeedLikes')
    .select('*')
    .in(
      'feedId',
      feeds.map((feed) => feed.id),
    );

  if (likesError) {
    console.error('Error fetching likes:', likesError);
    return [];
  }

  const likeCounts = feeds.reduce((acc, feed) => {
    const likeCount = likes.filter((like) => like.feedId === feed.id).length;
    acc[feed.id] = likeCount;
    return acc;
  }, {} as Record<number, number>);

  const postsWithLikes = feeds.map((feed) => {
    return {
      ...feed,
      image: feed.image ? JSON.parse(feed.image) : [],
      region: feed.region || '',
      sigungu: feed.sigungu || '',
      like_count: likeCounts[feed.id] || 0,
    };
  });

  postsWithLikes.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));

  return postsWithLikes.slice(0, 4);
}

function PopularPosts({ userId, userNickname }: PopularPostsProps) {
  const [popularPosts, setPopularPosts] = useState<PostWithLikes[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularPosts = async () => {
      const posts = await getPopularPosts(userId);
      setPopularPosts(posts);
    };

    fetchPopularPosts();
  }, [userId]);

  return (
    <div className="mt-[42px]">
      <hr className="border-gray-300 mx-[16px]" />
      <h3 className="text-xl font-semibold mt-[42px] mx-[16px]">
        {userNickname}님의 인기글이에요
      </h3>
      <div className="px-[16px] my-[24px]">
        <button
          onClick={() => router.push(`/profile/${userId}`)}
          className="text-blue4 border-blue4 border-[1px] rounded-[16px] py-[16px] w-full text-[16px] font-semibold"
        >
          {userNickname}님 프로필 보러가기
        </button>
      </div>
      <div className="grid grid-cols-2 gap-[15px] mx-[16px]">
        {popularPosts.map((post) => (
          <div
            key={post.id}
            className="relative w-full aspect-square bg-cover bg-center cursor-pointer rounded-[16px]"
            style={{ backgroundImage: `url(${post.image[0] || ''})` }}
            onClick={() => router.push(`/feed-detail/${post.id}`)}
          >
            <div className="absolute bottom-0 left-0 text-white p-[15px] w-full h-full rounded-[16px] bg-black bg-opacity-40 flex flex-col justify-end">
              <p className="text-sm">
                {post.region} {post.sigungu}
              </p>
              <p className="text-lg font-semibold">{post.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularPosts;
