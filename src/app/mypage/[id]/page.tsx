'use client';

import { createClient } from '@/utils/supabase/client';
import { showToast } from '@/utils/toastHelper';
import { ChangeEvent, useEffect, useState } from 'react';
import PostIcon from '@/components/IconList/PostIcon';
import PenIcon from '@/components/IconList/PenIcon';

function MyPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState({
    nickname: '',
    email: '',
    profileImage: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({
    nickname: '',
    profileImage: '',
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWritingPostsSelected, setIsWritingPostsSelected] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        showToast('error', `에러: ${error.message}`);
      } else if (user) {
        setIsAuthenticated(true);
        const { data, error: profileError } = await supabase
          .from('Users')
          .select('nickname, email, profileImage')
          .eq('id', user.id)
          .single();

        if (profileError) {
          showToast('error', `프로 파일 에러: ${profileError.message}`);
        } else {
          setProfile(data);
          setEditProfile({
            nickname: data.nickname,
            profileImage: data.profileImage,
          });
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        showToast('error', `슈퍼베이스 에러: ${error.message}`);
      } else if (user) {
        const { data, error: postsError } = await supabase
          .from(isWritingPostsSelected ? 'Posts' : 'Favorites')
          .select('*')
          .eq('userId', user.id);

        if (postsError) {
          showToast('error', `게시물 에러: ${postsError.message}`);
        } else {
          setPosts(data);
        }
      }
      setLoading(false);
    };

    fetchPosts();
  }, [isWritingPostsSelected]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('profileImage')
      .upload(`avatar_${Date.now()}.png`, file);

    if (error) {
      showToast('error', `이미지 업로드 에러: ${error.message}`);
      return null;
    }

    return data.path;
  };

  const handleUpdate = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      showToast('error', `프로파일 업로드 에러: ${error.message}`);
    } else if (user) {
      let imagePath = profile.profileImage;

      if (newImageFile) {
        const path = await uploadImage(newImageFile);
        if (path) {
          imagePath = `https://cuxcqeqwbwfuxipnozwy.supabase.co/storage/v1/object/public/profileImage/${path}`;
        }
      }

      const { error: updateError } = await supabase
        .from('Users')
        .update({
          nickname: editProfile.nickname,
          profileImage: imagePath,
        })
        .eq('id', user.id);

      if (updateError) {
        showToast('error', `프로필 파일 업로드 에러: ${updateError.message}`);
      } else {
        setProfile((prev) => ({
          ...prev,
          nickname: editProfile.nickname,
          profileImage: imagePath,
        }));
        setIsEditing(false);
        showToast('success', '프로필 수정이 완료되었습니다.');
      }
    }
  };

  return (
    <div className="pt-10 flex flex-col h-svh ">
      <div
        className={`flex items-center rounded-2xl w-full h-28 ${
          isAuthenticated ? 'bg-[#DBEEFF]' : 'bg-[#FFF4F0]'
        }`}
      >
        <div className="relative flex items-center w-full justify-between p-5  ">
          <img
            src={
              imagePreview ||
              profile.profileImage ||
              'https://via.placeholder.com/150'
            }
            className="h-16 w-16 rounded-full"
            alt="Profile"
          />
          {!isAuthenticated && (
            <a href="/sign-in">
              <button className="ml-4 p-2 bg-[#FD8B59] text-white rounded-xl ">
                로그인 · 회원가입하러가기
              </button>
            </a>
          )}
          {isEditing && (
            <div>
              <label
                htmlFor="file-input"
                className="absolute bottom-6 right-11 cursor-pointer"
              >
                <PenIcon />
              </label>
              <input
                type="file"
                id="file-input"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </div>
        <div>
          {isAuthenticated && !isEditing && (
            <div>
              <div className="mt-5 mr-6">{profile.email}</div>
              <div className="mb-5">{profile.nickname}</div>
            </div>
          )}
          {isAuthenticated && isEditing && (
            <div>
              <div className="mt-5 mr-8">{profile.email}</div>
              <div className="mb-5">
                <input
                  type="text"
                  value={editProfile.nickname}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      nickname: e.target.value,
                    })
                  }
                  className="p-1 border rounded w-28"
                />
              </div>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <div>
            {isEditing ? (
              <div className="flex flex-col space-y-2 ">
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdate}
                    className="m-2 w-24 rounded-md bg-sky-500 text-white"
                  >
                    수정 완료
                  </button>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="m-2 w-24 rounded-md bg-gray-500 text-white"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="m-5 w-24 rounded-md bg-sky-500 text-white"
              >
                프로필 수정
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center w-full mt-6">
        <button
          className={`p-2 flex-1 ${
            isWritingPostsSelected
              ? 'bg-white text-black border-b-4 border-[#118DFF]'
              : 'text-gray-400 border-b-4 border-b-white'
          }`}
          onClick={() => setIsWritingPostsSelected(true)}
        >
          작성한 글
        </button>
        <button
          className={`p-2 flex-1 ${
            !isWritingPostsSelected
              ? 'bg-white text-black border-b-4 border-[#118DFF]'
              : 'text-gray-400 border-b-4 border-b-white'
          }`}
          onClick={() => setIsWritingPostsSelected(false)}
        >
          찜한 글
        </button>
      </div>

      <div className="flex flex-1 justify-center py-10 bg-gray-50 items-center">
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <div className="flex  flex-col items-center">
            <PostIcon />
            <p className="mt-2">작성한 게시글이 없어요</p>
          </div>
        ) : (
          <div>{/* 작성한 게시글 */}</div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
