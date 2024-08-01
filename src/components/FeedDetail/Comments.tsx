'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { XMarkIcon } from '@heroicons/react/24/outline';

dayjs.extend(relativeTime);

type Comment = {
  id: number;
  feedId: number;
  content: string;
  userId: string;
  createdAt: string;
  Users: {
    profileImage: string;
    nickname: string;
  } | null;
};

type CommentsProps = {
  postId: number;
  onClose: () => void;
};

function Comments({ postId, onClose }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('FeedComments')
        .select('*, Users (profileImage, nickname)')
        .eq('feedId', postId)
        .order('createdAt', { ascending: true });

      if (error) {
        console.error(error);
      } else if (data) {
        setComments(data);
      }
    };

    fetchComments();
  }, [postId, supabase]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = '2596d4ff-f4e9-4875-a67c-22abc5fdacfa'; // 임시 사용자 ID

    const { data, error } = await supabase
      .from('FeedComments')
      .insert({
        feedId: postId,
        content: newComment,
        userId,
      })
      .select();

    if (error) {
      console.error(error);
    } else if (data) {
      setComments((prevComments) => [...prevComments, data[0]]);
      setNewComment('');
      setNotification('댓글이 등록되었습니다');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-full h-[80vh] max-w-2xl relative overflow-auto mt-20">
        <XMarkIcon
          onClick={onClose}
          className="absolute top-3 right-2 text-xl font-bold h-6 w-6 cursor-pointer"
        ></XMarkIcon>
        <hr className="border-gray-300 mt-8 mb-4" />
        {notification && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            {notification}
          </div>
        )}
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="mb-6 flex items-center">
              <img
                src={
                  comment.Users?.profileImage || '/path/to/default/avatar.png'
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <div className="flex">
                  <p className="font-semibold text-14px mr-2">
                    {comment.Users?.nickname || '알 수 없음'}
                  </p>
                  <p className="text-gray-500 text-14px">
                    {dayjs(comment.createdAt).fromNow()}
                  </p>
                </div>
                <p className="mt-1 text-14px">{comment.content}</p>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요"
            required
            className="textarea no-focus w-full"
          />
          <button type="submit" className="btn mt-2">
            댓글 등록
          </button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
