'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Post } from '@/types/post';
import Comments from '@/components/FeedDetail/Comments';
import DetailLikeBtn from '@/components/FeedDetail/DetailLikeBtn';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import useAuthStore from '@/zustand/useAuthStore';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'react-toastify';
import DeletePrompt from '@/components/DeletePrompt';
import FeedDetailSkeleton from '@/components/FeedDetail/FeedDetailSkeleton';
import PopularPosts from '@/components/FeedDetail/PopularPosts';

import regionsData from '@/data/regions.json';

type Sigungu = {
  rnum: number;
  code: string;
  name: string;
};

type Region = {
  rnum: number;
  code: string;
  name: string;
  ename: string;
  image: string;
  sigungu: Sigungu[];
};

type RegionsData = {
  region: Region[];
};

const regions: RegionsData = regionsData as RegionsData;

const supabase = createClient();

async function fetchPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('Feeds')
    .select(
      `
      *,
      Users (
        profileImage,
        nickname
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return {
    ...data,
    image: data.image ? JSON.parse(data.image) : [],
    region: data.region || '',
    sigungu: data.sigungu || '',
    userProfile: data.Users
      ? {
          profileImage: data.Users.profileImage,
          nickname: data.Users.nickname ?? '알 수 없음',
        }
      : { profileImage: null, nickname: '알 수 없음' },
  };
}

async function fetchCommentCount(postId: number): Promise<number> {
  const { count, error } = await supabase
    .from('FeedComments')
    .select('id', { count: 'exact', head: true })
    .eq('feedId', postId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

type PostPageProps = {
  params: { id: string };
};

function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const { user } = useAuthStore();
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // 모바일 시안에서 모달 상태 관리

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    updateMedia();
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await fetchPost(params.id);
      if (fetchedPost) {
        setPost(fetchedPost);
      }

      const fetchedCommentCount = await fetchCommentCount(parseInt(params.id));
      setCommentCount(fetchedCommentCount);
    };

    fetchData();
  }, [params.id]);

  if (!post) {
    return <FeedDetailSkeleton />;
  }

  const images = Array.isArray(post.image) ? post.image : [post.image];
  const userProfileImage =
    post.userProfile?.profileImage || '/default-profile.jpg';
  const userNickname = post.userProfile?.nickname || '알 수 없음';

  const handleEdit = () => {
    if (!user || user.id !== post.userId) {
      toast.error('수정 권한이 없습니다.');
      return;
    }

    const queryParams = new URLSearchParams({
      id: String(post.id),
      title: post.title,
      content: post.content,
      region: post.region,
      sigungu: post.sigungu,
      image: JSON.stringify(post.image),
    });

    router.replace(`/feed-write?${queryParams.toString()}`);
  };

  const handleDelete = async () => {
    toast(<DeletePrompt onConfirm={performDelete} />, {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    });
  };

  const performDelete = async () => {
    const { error } = await supabase.from('Feeds').delete().eq('id', post.id);

    if (error) {
      console.error('Delete Post Error:', error);
      toast.error('피드 삭제에 실패하였습니다.');
    } else {
      toast.success('피드가 성공적으로 삭제되었습니다.');
      router.replace('/feed');
    }
  };

  const handleRegionClick = () => {
    const regionData = regions.region.find(
      (region) => region.name === post.region,
    );
    const englishRegionName = regionData ? regionData.ename : '';

    if (englishRegionName) {
      router.push(`/local/${englishRegionName}`);
    } else {
      toast.error('해당 지역의 영어 이름을 찾을 수 없습니다.');
    }
  };

  const isAuthor = user?.id === post.userId;

  return (
    <div className="min-h-screen bg-gray0 pb-5">
      {isDesktop ? (
        // 웹 시안 레이아웃
        <div className="xl:px-[340px] xl:pt-[32px]">
          <Swiper
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={src}
                  alt={`Image ${index}`}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="xl:flex xl:space-x-[40px] mt-[64px]">
            {/* 왼쪽 섹션 */}
            <div className="flex flex-col xl:w-[800px]">
              <button
                onClick={handleRegionClick}
                className="font-medium text-[20px] text-white bg-orange3 px-[16px] py-[8px] rounded-[12px] self-start w-[205px] h-[46px]"
              >
                {`${post.region} ${post.sigungu}`}
              </button>
              <p className="text-[48px] font-medium mt-[48px]">{post.title}</p>
              <p className="text-[14px] font-normal mt-[24px]">
                {post.content}
              </p>
              <hr className="border-t border-gray6 my-[48px]" />
              <div className="flex">
                <DetailLikeBtn
                  postId={post.id}
                  userId={user?.id ?? ''}
                  onCommentClick={() => {}}
                  commentCount={commentCount}
                />
              </div>
              {/* 댓글 입력창과 댓글 목록 */}
              <Comments postId={post.id} onClose={() => {}} />
            </div>

            {/* 오른쪽 섹션 */}
            <div className="flex flex-col xl:w-[400px]">
              <div className="bg-blue1 p-[16px] rounded-[18px] shadow">
                <div className="flex items-center p-[8px]">
                  <Image
                    src={userProfileImage}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-[72px] h-[72px] rounded-full"
                  />
                  <p className="pl-[32px] text-[20px] font-semibold">
                    {userNickname}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => router.push(`/profile/${post.userId}`)}
                    className="text-gray0 font-medium text-[20px] bg-blue4 w-full h-[62px] rounded-[16px] mt-[24px]"
                  >
                    프로필 구경하기
                  </button>
                </div>
              </div>
              <PopularPosts userId={post.userId} userNickname={userNickname} />
            </div>
          </div>
        </div>
      ) : (
        // 모바일 시안 레이아웃
        <div>
          <div className="flex items-center justify-between h-14 mt-2 px-4">
            <div className="flex items-center">
              <Image
                src={userProfileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-2"
              />
              <p className="font-semibold text-sm">{userNickname}</p>
            </div>
            <button
              onClick={handleRegionClick}
              className="font-semibold text-sm text-white bg-orange3 px-3 py-1.5 rounded-lg"
            >
              {`${post.region} ${post.sigungu}`}
            </button>
          </div>
          <Swiper
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={src}
                  alt={`Image ${index}`}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <DetailLikeBtn
            postId={post.id}
            userId={user?.id ?? ''}
            onCommentClick={() => setIsCommentModalOpen(true)} // 모바일 시안에서는 모달 열기
            commentCount={commentCount}
          />
          <div className="mx-4 mb-5 px-4 py-2.5 bg-white rounded-3xl">
            <p className="text-2xl font-bold mb-2">{post.title}</p>
            <p className="text-sm text-gray-500 mb-2">
              {formatDate(post.createdAt)}
            </p>
            <p className="text-base font-normal">{post.content}</p>
          </div>
          {isAuthor && (
            <div className="flex space-x-4 ml-[16px]">
              <button
                onClick={handleEdit}
                className="btn border-2 border-blue4 text-blue4 font-semibold text-sm bg-transparent px-4 py-2 rounded-md hover:bg-blue4 hover:text-white transition-colors duration-300"
              >
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="btn border-2 border-blue4 text-blue4 font-semibold text-sm bg-transparent px-4 py-2 rounded-md hover:bg-blue4 hover:text-white transition-colors duration-300"
              >
                삭제하기
              </button>
            </div>
          )}
          {isCommentModalOpen && (
            <div className="fixed inset-0 z-50">
              <Comments
                postId={post.id}
                onClose={() => setIsCommentModalOpen(false)}
              />
            </div>
          )}
          <PopularPosts userId={post.userId} userNickname={userNickname} />
        </div>
      )}
    </div>
  );
}

export default PostPage;
