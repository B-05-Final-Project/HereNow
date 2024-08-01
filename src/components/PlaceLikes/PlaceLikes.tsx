import React, { useEffect, useState } from 'react';
import PostIcon from '../IconList/PostIcon';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/supabase';
import useAuthStore from '@/zustand/useAuthStore';
import { showToast } from '@/utils/toastHelper';
import Image from 'next/image';

export default function PlaceLikes() {
  const [placeLikes, setPlaceLikes] = useState<Tables<'PlaceLikes'>[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    const fetchPlaceLikes = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('PlaceLikes')
          .select('*')
          .eq('userId', user.id);

        if (error) {
          showToast('error', '슈퍼베이스 불러오는중 오류가 발생했습니다');
          console.log(error.message);
        }
        if (!data) return;
        setPlaceLikes(data);
        console.log(data);
      } catch {}
    };

    fetchPlaceLikes();
  }, [user?.id]);

  return (
    <>
      {placeLikes.length === 0 ? (
        <div className="flex flex-col items-center h-full justify-center">
          <PostIcon />
          <p className="mt-2">찜한 장소가 없어요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {placeLikes.map((like) => (
            <div key={like.id} className="p-4 border rounded">
              {like.imageUrl && (
                <Image
                  src={like.imageUrl}
                  alt={like.name}
                  width={200}
                  height={200}
                  className="rounded aspect-square object-cover"
                />
              )}
              <h3>{like.name}</h3>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
